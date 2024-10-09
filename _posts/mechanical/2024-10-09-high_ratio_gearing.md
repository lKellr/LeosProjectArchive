---
layout: post
title: High Ratio Gearing
date: 2024-10-09
tags:
  - gears
  - theory
categories: mechanical
math: "true"
---
> Disclaimer: the following text is mostly based on Müller W. Herbert  (1988) "Die Umlaufgetriebe: Auslegung und vielseitige Anwendungen". This is of course in German, but there appears to be an English language version called  "Epicyclic Drive Trains: Analysis, Synthesis, and Applications" if deeper insight is desired.

Even if the title might suggest otherwise, i will not present all possibilities to achieve gear ratios with very high values, but focus on just a single type, which however appears in many different, almost unrecognizable forms. Once you understand how they work, you can recognize them in lots of places where a high gear ratio is desired.

It is of course possible to achieve arbitrarily high ratios using a single pair of spur gears with huge diameter ratios or using a large number of stages. The type of gearbox i will present here is however able to achieve these ratios in a single stage [^1] and in a very compact size.
The downside is that this comes at a vanishingly low efficiency, making them unsuitable for power transmission.
# Kinematics
The main commonality of all these gears is that they are all epicyclic. Their kinematics are therefore described by the Willis equation presented in the [previous post]({% post_url mechanical/2024-09-09-epicyclic_gear_basics %}).

In particular, for the type of gear presented here, we fix the $2$-(ring)gear and are interested in the transmission ratio between the carrier and the sun gear. Compared to ordinary planetary gears, the operating direction is reversed: the carrier serves as the input and the sun gear sits on the output shaft.

Since $n_2 = 0$, the Willis equation gives

$$
i_{\mathrm{s}1} = \frac{n_\mathrm{s}}{n_1} = \frac{1}{1 - i_{12}}.
$$

With $i_{12} = 1$, the transmission ratio rises to infinity.
Infinity itself can of course not be reached, as that would mean that the sun gear is locked together with the ring gear[^2]. But because of how quickly the quotient rises for $i_{12}$ close to one, very high ratios are indeed possible.

To get such a ratio, the transmission ratio must be positive, which means that using the standard layout with a single ring gear does not work.
In addition,  the tooth counts of the sun and ring gear have to be very close, meaning a tooth difference $\Delta z$ of only $1$-$2$. But even then, a high tooth count is required to get the ratio close enough to $1$. This can be seen by rewriting the above equation using $z_2 = z_1 + \Delta z$ which leads to

$$i_{\mathrm{s}1} = \frac{z_1}{\Delta z}.$$

So the tooth count is directly related to the achievable transmission ratio.
High number of teeth can however be difficult to produce. For example with SLA 3D printing, one is limited to a module of around $\pu{0.5mm}$. Combining this with the limited printing volume of $\pu{60 mm}$ on my Elegoo Mars, i am limited to at most 120 teeth, and therefore a maximum ratio of $119:1$.
This still gets one to high ratios in the hundreds, but we want to go at least one magnitude higher.

To offset this problem, one uses stepped planets.
These are two spur gears fixed face-to-face along their common axis. One profile meshes with the sun gear, while the other one meshes with the ring gear. The ratio $i_{12}$ is then not anymore independent on the planets, but depends on their gear ratio as well[^3].

With $$i_{12} = i_{1 \mathrm{p}_1} i_{\mathrm{p}_2 2}$$, a differential effect can be exploited. Each ratio on its own can not be too close to one (because of the tooth count limitations), but with one ratio slightly greater and one slightly smaller than one, the overall ratio approaches one much closer.
We again select $z_1$ as the "base" tooth count. Then the best transmission ratio for the first tooth contact results from $$z_{\mathrm{p}_1} = z_1 - \Delta z$$ [^4], with $\Delta z$ equal to $1$ or $2$. The other planet profile uses $$z_{\mathrm{p}_2} = z_1$$ teeth, which means that $$z_2 = z_1 + \Delta z$$.
Inserting all that into the Willis equation results in

$$
\begin{equation}
i_{\mathrm{s}1} = \frac{1}{1 - \frac{z_1- \Delta z}{z_1} \frac{z_1+ \Delta z}{z_1}} = \left(\frac{z_1}{\Delta z}\right)^2.
\end{equation}
$$

The scaling of the ratio with increasing tooth count is now quadratic. The $120$ teeth limit on my 3D printer then allows for a maximum transmission ration of $14400:1$.
# The Base Layouts
In this derivation we have assumed that all tooth numbers are positive, meaning no ring gears are used. 
The previous ring gear $2$ has then almost the same size as the sun gear, just with the difference that it is affixed to the housing. 
This arrangement is made possible by the stepped planets, another advantage of them. Now the two parts – or gear engagements – can be positioned behind each other, with the planets orbiting around the two inner gears. It shows only slight resemblance to an ordinary planetary gear:

![](/assets/Planetaries/HighRatioExternal.svg)
_Implementation of the gearbox with external gears._


A positive sign of $$i_{12}$$ is of course also attained by selecting two negative tooth numbers, i.e., making the $1$ gear internal, with the planets moving around inside of the two ring gears.

![](/assets/Planetaries/HighRatioDefault.svg)
_Implementation of the gearbox with internal gears._

This is preferred, because it allows the external gears to “envelope" the planets, resulting in a large fraction of teeth in simultaneous contact. In addition, the axial offset of the planets is kept lower, which is good for balance.

The implementation using ring gears is sold as an Acbar/Akbar gear, for example [here](https://www.akim.ch/AKIM-Produkte.html).
For 3D printing, i created my own design, which can be downloaded [on thingiverse](https://www.thingiverse.com/thing:5933178). It achieves almost $13000:1$ in a size not much bigger than a NEMA 17 motor.

With actual gear profiles, the almost equal diameters cause lots of sliding action on the tooth flanks with ring gears. The power transmission therefore works like cam action between individual teeth.
This is another way to view the functional principle of the gearbox, that also explains the high losses by the large amount of slip and connects it to *rotate vector reducers*.
They look very similar, but the inner gear does not rotate, it is just wobbling around. This is however enough movement for cam action.
The cam-teeth are however not a complete explanation, since friction wheel (or v-belt) realizations of the kinematics that completely eliminate the cam action and friction are also possible as a thought experiment. They are not practical however, since there would be almost no torque transmission capabilities unless used with immense pressures between the wheels.
# Downsides
The biggest difference of these high ratio gearboxes is their low efficiency, which is  inversely proportional to the transmission ratio. The output speed decreases with $i_{\mathrm{s}1}$ but not with a proportional gain in output torque. 
For this reason, they can be called high ratio, but at the same time not necessarily high torque. 
Where they are applied is in applications which demand high output precision, but not really to reach high torques or to transmit large power.
# Derivatives
In addition to the standard arrangement, there is almost no limit on the variations to implement the kinematics from the Willis equation.
- A cycloidal gearbox uses the eponymous cycloidal curve which meshes with cylinders on the other side. Because these cylinders can be freely rotating, the problematic friction losses are reduced considerably, so that they even become backdriveable. Tooth count and therefore transmission ratio is however limited. Further differences are that the output is distributed over multiple cams and the fact that stepped planets are typically not used. They therefore resemble just the single stage version.
- Strain-Wave gears have flexible planets that are not really rotating but perform a similar motion forced by the wave generator. One can imagine the wave generator as the planet which is separated from its teeth. The reason for that is the elimination of backlash. On the other hand the stiffness is also reduced.
- With bevel gears, the transmission becomes a pericyclic (nutating) gearbox, as [this](https://www.youtube.com/watch?v=Z-zUTS5FPPc) one that recently appeared on YouTube. It trades radial with axial space.
- There is also [another of my designs on thingiverse](https://www.thingiverse.com/thing:6548761). To eliminate backlash and produce high quality meshing contacts, small telescope mounts (and 3D printers) commonly use timing belts.  Because they also need high transmission ratios, i thought i could combine the two approaches. 

![](/assets/Planetaries/EpicyclicPulley.svg)
_Belt and Pulley variant._

Kinematically this gearbox is the same as the others above. After all, belt and pulley style transmissions are just separated gears. The internal gear version is of course not possible to implement, as there is no real way to create pulleys with internal contact.
However, the force transmission works a bit differently (there are only tangential forces, no normal forces) and this results in a really nice interpretation of its function which i describe [here]({% post_url astro/2024-03-24-designing_a_gearbox_for_a-_star_tracking_mount %}).
The transmission ratio is rather low at only 169:1, because large pulleys are uncommon and get quite large and the choice of gear ratios is limited by the availability of short belt lengths. Also, this takes up more space than with gear teeth because of the required separation distance between the two pulleys. 

___
[^1]:  One could argue that it is actually in two stages, since there are two tooth contacts.
[^2]: This observation already hints at how the torque flows in this transmission: The locking between sun gear and ring gear (i.e., the housing) is increased, so that the high output torque is provided by the housing and redirected away from the carrier. A bit how an amplifier functions.
[^3]: Note that for ordinary epicyclic gears, the transmission ratio is independent of the number of planet teeth. The number of teeth can be chosen independently and is often chosen to be less than the one suggested by the axial distances ($z_\mathrm{p} = \frac{-z_2 - z_1}{2}$), due to a profile shift.
[^4]: The other possibility $z_{\mathrm{p}_1} = z_1 + \Delta z$ results in a different formula as well as the output shaft rotating in the opposite direction.