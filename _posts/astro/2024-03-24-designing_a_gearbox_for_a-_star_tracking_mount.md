---
layout: post
title: Designing a Gearbox for a Star Tracking Mount
date: 2024-03-24
math: "true"
tags:
  - thingiverse
  - theory
  - design
  - gears
categories: astro
---
To make the telescope mount presented in [this post]({% post_url astro/2024-03-22-EQ_mount_build_instructions %}) actually useful, it has to be motorized with at least a polar axis. For this i intend to use the open source [OnStep controller](https://onstep.groups.io/).
On the mechanical side, this requires stepper motors and some kind of transmission to match the low rotation speed of earth. The usual way is to purchase a fitting planetary gearbox.
Because high precision variants can get somewhat expensive and i like designing uncommon gearboxes, my plan is to develop my own 3D printed solution.
# Requirements
Three main things are important for such a transmission.
- a high ratio of around 80 - 600
- low backlash
- high stiffness
# Type
We can compare a couple of standard configurations on these requirements
1. _Spur gears_ are the default option for all kinds of transmissions. For the high speed ratio required, they would however require a large number of stages (4-6) and the backlash is also difficult to eliminate, especially using 3D printed gears.
2. _Planetary Drives_ would be more compact than spur gears, because the ratio reachable in a single stage is much higher and they can be conveniently stacked axially. The backlash problem is however still there and the complexity is higher.
3. _Worm Drives_ are probably the best option for normal OnStep controllers. They can be very stiff and the usual transmission ratios of a single stage lie exactly in the required range. Backlash can be minimized by making the worm adjustable. The geometrical complexity is however very high and worms are basically impossible to 3D print at the required accuracy.
4. _Strain Wave Drives_ can be seen as very specialized planetary drives with just a single planet that deforms from the motion of the carrier. They reach high ratios in a single stage, are very stiff and eliminate backlash completely. This would be a very good option to 3D print, but i doubt the stiffness and longevity of a printed deformable spline. Furthermore, my mount is designed around a motor that is offset from the axis. The transmission should therefore be short in the radial direction. For a strain wave gear set, the required ratio would therefore required a small module ($\pu{0.5 mm}$ - $\pu{1mm}$) with therefore just a few pixels per tooth on my DLP printer. Here i again doubt that this gives high enough accuracy for tracking.

There is an additional option to the gear based transmissions: _belt drives_, which are often used as a last stage after the main reduction. They allows to drive an offset axis and do not cause  any additional backlash. A user on the OnStep forum has created [a full 125:1 gearbox with these pulleys](https://cults3d.com/de/modell-3d/werkzeuge/gt2-high-precision-gearbox-0-backlash)

Belts can be imagined abstractly as a way to transmit rotational motion just like with gear teeth, but to a shaft at an arbitrary distance away[^1].
That is why you might imagine to implement the kinematics of the previous gearboxes with belt and pulley designs[^2].  The biggest obstacle to overcome is that there are no ring gear equivalents for pulleys, because they would be difficult to keep under tension. While ring gears are preferred for their better contact ratio and for allowing radial stacking, it is also possible in planetary type gears to utilize just spur gears.

A belt and pulley transmission using the kinematics of Planetary/Strain-Wave drives has the advantage of being able to use cheap belts with 3D printed pulleys and to eliminate backlash.
# Layout
The design i settled on is the following:

![](/assets/Planetaries/EpicyclicPulley.svg)

The kinematics are equivalent to acbar/strain-wave/cycloidal gears, but with a pulley in the place of the ring gear. More information on the (kinematic) relationship between these transmission types can be found in my post on high ratio gearing.

The achievable ratio is

$$
i_{\mathrm{S}1} = \left(\frac{z_1}{\Delta z}\right)^2,
$$

where $z_1$ now stands for the number of teeth on the $p_1$ and $2$ pulleys. Pulley $p_2$ has $\Delta z$ less teeth, while pulley $1$ has $\Delta z$ additional ones.

The high transmission ratio is achieved by two effects that are illustrated below:
- pulleys of almost the same size results in an extremely small belt angle. This converts small radial forces to very high tangential (belt) forces
- in the stepped planet design, the applied moment is balanced by the __difference__ between the two almost equal belt forces in radial direction. The amplification into belt forces is therefore even higher.
This is exactly the same principle as in the [differential pulley (wiki)](https://en.wikipedia.org/wiki/Differential_pulley).
![](/assets/Planetaries/PulleyAmplification.svg)
# Size
The minimum size of this arrangement, assuming minimal belt length with pulleys in contact with each other and without housing is approximately

$$d_\text{min} \approx p/\pi \cdot (3 z_1 + \Delta z).$$

We can compare this to some classical (stationary) belt transmissions:
- the 3D printed OnStep design featured above :
	- 5 stages with 60/12 pulley ratios
	- $i = 125$
	- $d_\text{min} = \pu{46 mm}$ ($d_\text{actual} = \pu{70 mm}$)
- a smaller two-stage design with the same ratio
	- 2 stages with 80/12 pulley
	- $i = 125$
	- $d_\text{min} = \pu{58 mm}$
- epicyclic design with approximately the same ratio:
	- single stage with 22 $\pm$ 2 tooth pulleys
	- $i = 121$
	- $d_\text{min} = \pu{43 mm}$
- epicyclic design that i actually built:
	- single stage with 26 $\pm$ 2 pulleys
	- $i = 169$
	- $d_\text{min} = \pu{51 mm}$ ($d_\text{actual} = \pu{65 mm}$)
Compared to the stationary designs, the transmission ratio can be achieved at either a lower number of stages (therefore smaller axial size) or compared to the two stage pulley gearbox with a smaller gearbox diameter.
For even higher ratios the classical variants have of course the advantage that their radial size does not have to grow at all because they can be staged axially. On the other hand, the epicyclic variant can be staged (axially) just as well.

The (still untested) .stl files are available [on thingiverse](https://www.thingiverse.com/thing:6548761)

[^1]: With the difference that using an untwisted belt, the rotational direction of the two shafts is not flipped
[^2]: The worm gear excluded, there are no helical belts as far as i know