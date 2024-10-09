---
layout: post
title: Epicyclic Gear Basics
date: 2024-09-09
tags:
  - gears
  - theory
categories: mechanical
math: "true"
---
In a future post that is a bist of an addition to [my astro gearbox post]({% post_url astro/2024-03-24-designing_a_gearbox_for_a-_star_tracking_mount %}), i am planning to provide some information on gearboxes for very high transmission ratios. Because it became quite long, i am splitting it up into a first post that introduces some basics about epicyclic gears.
# The Basics
First some notation and basics about gears. 

Gears work by exchanging torque for rotational speed. Because the speeds are kinematically fixed, they are the more useful descriptor compared to the torque ratio, which is influenced by losses.
The transmission ratio $i$ is the ratio between the input and output speeds $n$. It results from the inverse ratio of the number of teeth $z$[^1]. the indices denote between which shafts the ratio is calculated.

$$\begin{equation}
i_{12} = \frac{n_1}{n_2} = \frac{z_2}{z_1}
\end{equation}$$

Because for ring gears, $z$ is taken as negative, the ratio can also be negative. In that case, the output shaft rotates into the opposite direction to the input shaft.

To describe the size of the gear teeth, the module is used, defined as

$$\begin{equation}
m = \frac{d}{z}.
\end{equation}$$
It can be understood as the pitch (the size of a tooth along the circumference) divided by $\pi$,  which avoids messy irrational numbers.

For the complex arrangements of multiple gears into a planetary gearbox, i am going to use schematics such as the in the next section. These show a side view of the gearbox, where alls ahfts are visible and the gears are cut along parallel to their teeth.

All shafts are denoted by lines, with rectangles of the same color for the gear wheels connected to them. Bearings are indicated with circles, but i am omitting some of the supports.
Hatching denotes parts connected to the housing, i.e., fixed.

For example, the internal gear $2$ in the schematic below is fixed to the housing, the sun $1$ and carrier $\mathrm{s}$ are connected to the housing, but free to rotate via bearings. The planet $\mathrm{p}$ is supported by the carrier and coupled to its rotation.
# Basic Operation

![](/assets/Planetaries/OrdinaryPlanetary.svg)

In epicyclic gears,  at least one stage of the gear train is not fixed to the housing, but rotates on its own shaft. This shaft is called the carrier, i will give it the index $\mathrm{s}$ from its German name _Steg_.
The simplest case derives from two stages of spur gears, with three gears on three shafts. Then the intermediate gear is put on a carrier shaft, and turns into a _planet_. 

Because the planet's rotation speed is completely determined from the shafts it is connected to and can not really be used to extract power from (it is rotating around after all), it can be mostly ignored for the purposes of transmission ratios.

What remains are three shafts with two degrees of freedom. From one transmission ratio characterizing the gearbox, all pairwise transmissions derive.
Now unless the gear is to operate as a summation gear[^2] , one of the degrees of freedom is eliminated by fixing one of the shafts to the housing, giving it a rotation speed of zero (not the carrier of course, else it is not epicyclic any more).
The other shafts are then the input and output.
# Constraints
In real gears, the single intermediate gear is multiplied to split the transmitted power. This splitting is the reason for the compactness of planetary gears. 

After the first planet has been inserted, the relative phases of the inner and outer gears are fixed with respect to each other. This means that additional planets an only be inserted in certain positions.
Usually it is desired to distribute all planets evenly around the circumference[^3]. In that case, the constraint for gears is

$$\begin{equation}
\frac{z_1 - z_2}{N} = g
\end{equation}$$


for $N$ planets and $g$ an arbitrary integer. As a result, only some gear ratios are possible.
With stepped planets this becomes even more difficult, as they need to fit into both meshes[^4].
# Kinematics
The kinematic description of all epicyclic gears consisting of a sun gear, carrier with planets and ring gear is summarized in the Willis equation. To derive it, the two basic rotation modes are superimposed:
- First, the carrier is held fixed and the gear operates like a standard, non-epicyclic transmission. The ratio between the sun and ring gear speeds in this mode is called $i_{12}$.
- In the second rotation mode, all gear components rotate in sync with the speed $n_\mathrm{s}$, as if they were a rigid body.
Superposition of these speeds results in the shaft speeds in general operation:

$$\begin{equation}
n_1 =  n_1^\mathrm{mode 1} + n_1^\mathrm{mode 2}  = n_1^\mathrm{mode 1} + n_\mathrm{s}
\end{equation}$$


$$\begin{equation}
n_2 = n_2^\mathrm{mode 1} + n_2^\mathrm{mode 2} = n_2^\mathrm{mode 1} + n_\mathrm{s}
\end{equation}$$

and the Willis equation is

$$
i_{12} = \frac{n_1^\mathrm{mode 1}}{n_2^\mathrm{mode 1}} =  \frac{n_1 - n_\mathrm{s}}{n_2 - n_\mathrm{s}}
$$

or more commonly

$$
\begin{equation}
n_1- i_{12} \, n_2 - (1 - i_{12}) \, n_\mathrm{s} = 0
\end{equation}$$

The ratio $i_{12}$ is the important number that characterizes a planetary gear completely. For setups like in mode 1, with a fixed carrier, it is the overall transmission ratio of the gearbox. However other ratios are achieved by holding different shafts fixed. All of those can be characterized by an expression involving just $i_{12}$, which is found from the Willis equation.

___
[^1]: Actually from the pitch diameter ratio, but this simplifies to the tooth ratio because both gears must use the same module.
[^2]: If two shafts are powered, the output speed and torque results from some linear combination of these speeds and torques. This design can be seen in hybrid cars to combine electric and combustion engine output together.
[^3]: Uneven distribution is a possibility of the desired ratio can otherwise not be attained. This comes however with the downsides of unevenly loaded planets and counterweights to fix the emerging imbalances.
[^4]: Unless one uses a phase shift between the two gear profiles. This has to be different for each planets and means that they are all different, have to be marked and inserted at the correct positions.