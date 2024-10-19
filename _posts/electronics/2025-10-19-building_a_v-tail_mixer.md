---
layout: post
title: Building a V-Tail Mixer
date: 2024-10-19
math: "true"
tags:
  - design
  - guide
categories: electronics
---
# Why Do I Need a V-Tail Mixer?
Previously I have flown an RC glider (that was more or less a barn find) with an old Graupner remote control that is probably from the 70s or 80s. After its death[^5] I wanted to utilize this remote in a newer glider. However, this glider has a v-tail. This does not work with the simple pitch/yaw commands from the old control/receiver.

Modern remotes can be programmed to support these, but not my ancient one. 
Therefore I wanted to use a small microcontroller behind the receiver that reads in the pitch and yaw commands, applies the necessary transformations to them and feeds them to the servo.
# Hardware Implementation
To fit on the RC glider, it had to be especially compact and light. Therefore, as a microcontroller I use the ATtiny85. 

Since the maximum voltage using 4 AA batteries can be up to $\pu{6V}$, but  the ATtiny is only tolerant up to  $\pu{5.5V}$, I am powering it from a diode that provides the necessary small voltage drop. Apart from that, only a decoupling capacitor and the input and output cables are on the board with the socket for the ATtiny.
It fits under the Bowden tubes, close to the receiver.
# Control Signal
The first problem is reading in the control signal coming from the receiver.
This signal is a PWM signal, but not a usual one. Its frequency is quite low at around $\pu{50 Hz}$ and not its duty cycle contains the information, but the width of the _high_ pulse.
This width is between around $\pu{1000µs}$ and $\pu{2000µs}$, corresponding to the maximum left and right deflections. A $\pu{1500µs}$ pulse therefore corresponds to the center position. However, these values are not exact and depend on the servo manufacturer and possibly even the individual servo.

As the overall period at $\pu{50 Hz}$ is $\pu{20 ms}$, the duty cycle is very low. The reason for this is to simplify operation with multiple channels.
The pulses of the different channels are staggered behind each other, meaning that when the signal on the first channel goes _low_ after the pulse, the signal on the second channel goes _high_ and so on.[^3] 
Luckily, the receiver puts out each pulse on a different pin, so it is not our work to identify the pulses with their channels.
# Measuring the Pulse Widths
To determine these pulse widths, I am detecting the start of the pulse and then starting a timer until the next falling edge on this pin. This has to be done for each of the two input channels – pitch and yaw.

In order to identify a pulse, I am using interrupts, which are activated with the following code:
```C
  uint8_t oldSREG = SREG;
  cli();
  GIMSK |= (1 << PCIE);
  PCMSK |= (1 << PIN_RECVR_YAW) | (1 << PIN_RECVR_PITCH);
  SREG = oldSREG;
```
In the first line, the old state of the interrupt register is saved, then they are disabled by the `cli()` call. The next two lines activate the pin change interrupt and specify the triggering pins.
Then the interrupts are reactivated with the old state.

The interrupt calls the function[^2]
```C
ISR(PCINT0_vect)
```
Inside of it, we first have to determine which pin has changed, and if it was rising or falling. For that we need the (digital) pin values. Instead of `digitalInput(PIN_RECVR)`, I read them directly from the register for speed. The ATtiny85 has only the _PINB_ registers and the pin numbers are equal to the register locations.[^4]
```C
  curr_pinval_yaw = (PINB & (1 << PIN_RECVR_YAW)) >> PIN_RECVR_YAW;
  curr_pinval_pitch = (PINB & (1 << PIN_RECVR_PITCH)) >> PIN_RECVR_PITCH;
```
With that, I first have to determine, which of the two channels has received the pulse. Here I check just the yaw channel, but it is exactly the same procedure for the pitch channel.
Then I determine if it is the start or the end of the pulse. At the pulse start, the current time is recorded in `rcv_yaw_start_pulse`.
When the pulse ends, the pulse time is the time when the pulse has ended minus the stored time at the start of the pulse. Because these values were a bit shorter than expected (and measured with an oscilloscope) I apply a correction of $\pu{50µs}$ via `PULSE_T_CORRECTION`.
Finally, I set the boolean `new_target`, that i then use to determine that the servos have received a new target. Due to the mixing, this target changes for both servos, even if only one channel received new commands.
```C
  if (last_pinval_yaw ^ curr_pinval_yaw)  // yaw pin changed
  {
    if (last_pinval_yaw == LOW)  // we have a rising edge
    {
      rcv_yaw_start_pulse = micros();  // start timer
    } else                             // we have a falling edge
    {
      int commanded_yaw = micros() + PULSE_T_CORRECTION - rcv_yaw_start_pulse;
      new_target = true;
      }
    }
    last_pinval_yaw = curr_pinval_yaw;
```
# V-Tail Mixing Logic
The equation, by which the servo angles for the v-tail are determined from pitch and yaw inputs are quite simple. For pitch, it is trivial: the commanded pitch value should be directly relayed to both rudders. For a yaw input on the other hand, the rudders have to move in opposing directions. If the yawing is to the left, the left rudder must move down and the right rudder up.
Therefore, if positive yaw means left yaw, the equations are something like

$$
\begin{align*}
\mathrm{rudder\ left} &= \mathrm{pitch} - \mathrm{yaw} \\
\mathrm{rudder\ right} &= \mathrm{pitch} + \mathrm{yaw}
\end{align*}
$$

Which equation has the negative sign depends on the setup of the remote, servos, and linkages. You can determine it simply by trial and error.

Because this equation is only valid if pitch and yaw are centered around $0$ and the output signal is also meant to be centered, the equation has to be de-normalized for servo control. This is achieved by subtracting the PWM center value $1500$ from pitch and yaw inputs and adding it back for the rudder outputs. You can see it done in the code below.

Secondly, the maximum values have to be adjusted. If summed together as in the snippet above, the range of values of the rudder variables is double that of the pitch and yaw variables. This can be fixed in two ways. First, the result of the addition can just be halved. Then the rudder values are always in the valid range of servo values, but the full deflection of the rudders can only be reached when both controls are fully activated at the same time.

The second option is to clip values outside the valid range to the maximum or minimum allowable ones. Then each control stick can use the whole available movement range of the rudders. On the other hand, this causes a problem of input saturation, where when one channel is fully deflected, the second channel only has control over one of the two rudders. The other one is fully saturated. For example during full positive pitch deflection, only the negative yaw input has an effect on the rudders, while the positive one is clipped away.

As a compromise between these two options, I added in a _saturation factor_, that – together with clipping – allows setting the mixing behavior between those two extremes. A factor of $0.5$ corresponds to halving the inputs, without any saturation. Any factor higher than that causes at least some saturation for the higher inputs, until at $1.0$, one rudder can be fully saturated. Higher values of the factor increase the onset of saturation behavior and reduce the input sensitivity of the saturating rudder at full deflection. For my glider, I decided on a high saturation value of $0.9$.

With saturation and proper rescaling, the equation for the rudder values are:
```C
mixed_L = constrain((pitch - yaw) * SUM_SATURATION_FACTOR + PWM_CENTER, PWM_MIN, PWM_MAX);

mixed_R = constrain((pitch + yaw - 2 * PWM_CENTER) * SUM_SATURATION_FACTOR + PWM_CENTER, PWM_MIN, PWM_MAX);
```

These can then directly be written to the servos. The ATtiny85 does not work with the standard servo library, but ATtinyCore provides its own version that works and functions just in the same way.
# Smoothing
When testing the code for the first time, I noticed that the output signal from the ATtiny is quite noisy. Without any control inputs from the remote, the servos were constantly jittering; making noise without any appreciably deflection.
To fix this, I added two things.
Firstly I am smoothing the measured control inputs by a filter. For this I am using the [Arduino Filters](https://github.com/tttapa/Arduino-Filters) library. [^1]
Most of the high frequency noise is eliminated with a 6th order Butterworth filter at a dimensionless cutoff frequency of $0.2$.

While this worked fine on the Arduino Leonardo used for testing, on the ATtiny85 the jitter was still pretty bad. I identified this with the ATtiny stalling due to the demand of the filter computation.

So I want back to a filter order of two, with a slightly lowered cutoff frequency of $0.1$.
To eliminate all the remaining jitter I also added a threshold value, set to $25$. New commands are ignored if they do not change the output signal by at least this magnitude. While this completely eliminates all jitter, it also means that the input is much coarser. It might for example be difficult to return to a true neutral $0$ value for the servos if the thresholding “locks” around a different center value.
# The Complete Code
```C
#include <Servo_ATtinyCore.h>
#include <Filters.h>
#include <Filters/Butterworth.hpp>

#define PIN_RECVR_YAW PB1
#define PIN_RECVR_PITCH PB2
#define PIN_SERVO_L PB3
#define PIN_SERVO_R PB4

#define PWM_MIN 1100  // Graupner
#define PWM_MAX 1850
#define PWM_CENTER ((PWM_MIN + PWM_MAX) / 2)

#define THR_JITTER 25              // jitter threshold; 5 ~= 1%
#define SUM_SATURATION_FACTOR 0.9  // at which deflection of one channel the controls can be saturated, no saturation would for 0.5, complete range for one channel for 1. (i.e. if you still would like to have control around the second axis for full deflection of the other axis)
#define PULSE_T_CORRECTION 50      // the pulse widths seemed to be biased to too low values
#define FLT_CUTOFF 0.1             // butterworth filter Normalized cut-off frequency in half-cycles per sample
#define FLT_ORDER 2                // butterworth filter order

int mixed_L, mixed_R;
volatile int target_pitch = PWM_CENTER, target_yaw = PWM_CENTER;
volatile bool new_target = false;
unsigned long rcv_yaw_start_pulse, rcv_pitch_start_pulse;
uint8_t last_pinval_yaw = LOW, curr_pinval_yaw = LOW, last_pinval_pitch = LOW, curr_pinval_pitch = LOW;
Servo servo_L, servo_R;
auto filter_pitch = butter<FLT_ORDER>(FLT_CUTOFF, true);
auto filter_yaw = butter<FLT_ORDER>(FLT_CUTOFF, true);

void setup() {
  pinMode(PIN_RECVR_YAW, INPUT);
  pinMode(PIN_RECVR_PITCH, INPUT);

  uint8_t oldSREG = SREG;                                  //  save previous interrupt state
  cli();                                                   // deactivate all interrupts
  GIMSK |= (1 << PCIE);                                    // set Pin Change Interrupt Enable Bit in the General Interrupt Mask Register
  PCMSK |= (1 << PIN_RECVR_YAW) | (1 << PIN_RECVR_PITCH);  // set Pin Change Enable Mask Bits
  SREG = oldSREG;

  servo_L.attach(PIN_SERVO_L, PWM_MIN, PWM_MAX);
  servo_R.attach(PIN_SERVO_R, PWM_MIN, PWM_MAX);
}

void loop() {
  if (new_target) {
    update_servos(target_pitch, target_yaw);
    new_target = false;
  }
}

ISR(PCINT0_vect)
{
  curr_pinval_yaw = (PINB & (1 << PIN_RECVR_YAW)) >> PIN_RECVR_YAW;
  curr_pinval_pitch = (PINB & (1 << PIN_RECVR_PITCH)) >> PIN_RECVR_PITCH;

  if (last_pinval_yaw ^ curr_pinval_yaw)  // yaw pin changed
  {
    if (last_pinval_yaw == LOW)  // we have a rising edge
    {
      rcv_yaw_start_pulse = micros();  // start timer
    } else                             // we have a falling edge
    {
      // de-jittering:
      int commanded_yaw = filter_yaw(micros() + PULSE_T_CORRECTION - rcv_yaw_start_pulse);
      if (abs(commanded_yaw - target_yaw) > THR_JITTER) {
        target_yaw = commanded_yaw;
        new_target = true;
      }
    }
    last_pinval_yaw = curr_pinval_yaw;
  }

  if (last_pinval_pitch ^ curr_pinval_pitch)  // pitch pin changed
  {
    if (last_pinval_pitch == LOW)  // we have a rising edge
    {
      rcv_pitch_start_pulse = micros();
    } else  // we have a falling edge
    {
      // de-jittering:
      int commanded_pitch = filter_pitch(micros() + PULSE_T_CORRECTION - rcv_pitch_start_pulse);
      if (abs(commanded_pitch - target_pitch) > THR_JITTER) {
        target_pitch = commanded_pitch;
        new_target = true;
      }
    }
    last_pinval_pitch = curr_pinval_pitch;
  }
}

void update_servos(int pitch, int yaw) {
  mixed_L = constrain((pitch - yaw) * SUM_SATURATION_FACTOR + PWM_CENTER, PWM_MIN, PWM_MAX);
  mixed_R = constrain((pitch + yaw - 2 * PWM_CENTER) * SUM_SATURATION_FACTOR + PWM_CENTER, PWM_MIN, PWM_MAX);
  servo_L.writeMicroseconds(mixed_L);
  servo_R.writeMicroseconds(mixed_R);
}
```

---
[^1]: It had to be modified somewhat to compile on the ATtiny85. Some code that is used for debugging depends n the printable class that is not defined in the ATtinyCore library. It was enough to just comment out the relevant sections.
[^2]: This is actually a macro.
[^3]: Therefore, 10 channels theoretically fit into one period. But one of the slots has to be kept unused to allow for the identification of the beginning of the period.
[^4]: A quick explanation for the code from the innermost bracket to the outermost: i create a mask for the interesting bit, then use this mask to filter it out from the register and finally shift it to the first position so that it can be read as either 0 or 1.
[^5]: Some things can be crashed and repaired only a limited number of times before they consist of more glue than wood.