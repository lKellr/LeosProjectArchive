After completing a design, it is important to be able to measure wether the expected performance has been met and if not, where improvements have to be made.

In my case, i had to measure wether a 3d printed nozzle did perform as desired and actually give the calculated mass flow.

As mass flow is not a quantity than can be easily measured directly, the common way is to calculate it from the flow speed as

$latex \dot{m} = \rho c A$

The density (or equally pressure and temperature for an ideal gas) is usually known and the flow cross section can be measured as well.

In order to measure the flow speed, multiple solutions exist ranging from the hot wire anemometer where flow speed is calculated from the heat flux from a heated wire in the flow to optical speed measurement of suspended particles. In some cases it is also possible to measure flow speed from the vortex shedding frequency on a rod in the stream.

In my case i wanted a simple solution without much electronics that is why i decided to build a Venturi flowmeter.

### Venturi Flowmeter Principle

The Venturi Flowmeter consists of a converging-diverging nozzle which accelerates the flow and a pressure sensor that monitors the accompanying pressure drop.

![](/assets/Venturi.webp)

If we use Bernoullis equation for a stationary, incompressible, adiabatic and isentropic flow, the following relation between pressure and velocity can be derived:

$latex p_t = p + 0.5 \rho c^2 $

is constant along a streamline.

Applying this to a point on the streamline before the constriction (indexed with 1) and a point on the same streamline directly at the throat (indexed with 2) gives the following relation:

$latex p_1 + \frac{\rho}{2} c_1^2 = p_2 + \frac{\rho}{2} c_2^2 $

From the conservation of mass and incompressibility, another relation can be derived:

$latex c_1 = c_2 \frac{A_2}{A_1}$

These two can be combined to find:

$latex c_1 = \sqrt{2 \frac{p_1-p_2}{\rho (\frac{A_1^2}{A_2^2} - 1)}}$

This means that the flow speed the throat can be calculated solely from the pressure difference before the orifice and at the throat. It is easily measured by a differential pressure transducer such as the NXP MPX5500.

This device works by measuring the displacement of a membrane with the two different pressure that are to be compared with the help of a piezoelectric sensing element. A voltage that is directly proportional to the pressure difference is produced at the output pin of the sensor.

Behind the throat, the flow is returned to the normal pressure and cross section. Here, the cone half angle is quite narrow, as this diffuser is prone to flow separation. In this case, the total pressure would not be recovered because of losses and the pressure behind the measurement point is reduced.

### Going Incompressible

However we have assumed an incompressible flow while using air as a medium (which is definitely compressible). Whether compressible effects are of relevance can be checked by calculating the Mach number.

If it is smaller than about 0.3 the incompressible assumption is usually good enough.

It can of course not be calculated exactly without knowledge of the actual flow speed, but we can still check the Mach number attained with the incompressible calculation for its validity.

In my case, the highest Mach number (at the narrowest cross section) is around 0.1, below the range where compressible effects are dominant.

The hereby calculated mass flow also agrees with the specification of my compressor, which is 23 l/min, so 2.3g/s at 5 bar and 290K.

If the Ma number approaches one however, the density is now not anymore a constant. This changes a lot of things. Previously, we were able to remove the density from both sides of the mass conservation equation (turning it into a conservation of volumetric flow), as it was the same for both points.

Furthermore, our old equation for the total pressure becomes invalid for compressible flows. Instead we have to use

$latex p_t = p (1 + \frac{\gamma - 1}{2} Ma^2)^\frac{\gamma}{\gamma - 1}$

with the Mach number

$latex Ma^2 = \frac{c}{\gamma R T}

As we now have two density values, we need an additional equation to close the system. This is the conservation of energy, which can be written in terms of the total enthalpy as

$latex h_t = h + 0.5 c^2 \neq const $

In contrast to the previous equations, the total enthalpy is not constant, as we want to include the effects of heat transport.

With the energy conservation equation we have introduced another new variable, h. As we assume a perfect gas, it is only dependent on the temperature and we can close our system with the help of the ideal gas law.

$latex p = \rho R T$

The stagnation quantities before the throat are known. However as we do measure neither the gas temperature at the throat nor the heat flux, we have too many unknowns to solve this system. One variable can however be eliminated by an assumption such as an isothermal (heat flux is just large enough to cause constant temperature) or isentropic (no losses or heat transport) process.

With the definition of a polytropic process we can encompass both assumptions.

With the assumption

$latex \frac{p}{\rho^n} = \textit{const.}$

we get an isentropic proces if we choose $latex n = \gamma$ wich is 1.4 for air. If we instead select $latex n=1$ the process is isothermal. For a real process, the polytropic coefficient will lie somewhere in between those two extremes.

The other equations give us a fully determined system that can now be solved to find the rather complicated expression:

$latex c_1^2 = 2 R T_1 \frac{1 - Pi^\phi}{\phi / \alpha^2 \Pi {\phi - 2/n} - 2\phi}$

with the abbreviations:

$latex \phi = \frac{\gamma - 1}{\gamma}$

$latex \alpha = \frac{A_2}{A_1}$

$latex \Pi = \frac{p_2}{p_1}$

Here we see that in the compressible case, the pressure difference alone is not anymore sufficient. The absolute pressure must be known as well. For the accuracy that i require, this is not a big problem. I just assume p_1 to be known (readoff from the compressor), just as i already did in the previous case in order to calculate the density from the ideal gas law (mass flow calculation).

In my case (Ma=0.1), the calculated flow speed with the compressible formula agrees with the incompressible calculation, as it should. If the mass flow is however increased to yield a throat Mach number of round 0.4, different values are predicted for the same pressure delta.

|                |                    |
| -------------- | ------------------ |
| incompressible | $39.5 \frac{m}{s}$ |
| isothermal     | $27.1 \frac{m}{s}$ |
| isentropic     | $28.2 \frac{m}{s}$ |

So which value is now the correct one? The answer is it depends.

The incompressible calculation is of course the most inaccurate one at this Mach number. Luckily the other two are quite close.

For a high mass flow in a well isolated nozzle the isentropic assumption is closer to the truth. If the residence time of the fluid is long, it has a low heat capacity and the nozzle easily conducts heat, the isothermal case can be a better assumption. Of course, both extremes are physically impossible, as isothermal flow implies maximum heat transfer without a temperature gradient and isentropic flow implies no heat transfer at all. The real value will lie in between these two extremes.

Of course, even with the compressible calculation, we did some rather rough approximations, such as a 1D flow without viscous dissipation. To correct for these, a discharge coefficient $C_D = \frac{\dot{m}_{real}{\dot{m}_{theo}}$ is often introduced that relates the theoretically predicted mass flow to the real one.

Values for it usually lie in the range of 0.98-1 and can be obtained from the literature or experiments.

In a follow-up blog post, we will run a three dimensional simulation of this nozzle including losses and compare the results to our 1D calculations. So be stoked for that.