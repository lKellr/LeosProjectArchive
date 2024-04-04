---
layout: post
date: 2024-03-30
title: Designing a Gearbox for a Star Tracking Mount II
categories: Telescope Gearbox 3D_printing
---
# Design
## Design Questions
- shaft diameters
- bearing sizes
- bearing locations
- pulley order
- number of planets
- belt width
- pulley size / transmission ratioStrength / Forces
- tensioning mechanism
- tooth delta -> ratio x4, but restricted by available minimum belt lengths
## Layout
The arrangement from [[#Layout]] needs some adjustments to be realizable.
First of all, the the "2" pulley must be fixed to the housing. That means that one of the two center pulleys must be hollow to allow to feed both shafts through.
Secondly, the large belt forces cause significant bending of all three shafts. To compensate this, it makes sense to use more than one planet. Already for two planets, the bending forces on the center shafts $1$ and $2$ cancels completely, leaving only the torque load. 
This modification does not cost space, just money for the bearings. Additionally, the carrier can is now balanced without requiring the use of counterweights [^1] .

- where to feed through the input and output shafts? One Pulley has to be hollow
- two planets to cancel bending forces but minimze complexity and cost
- how to deal wtih the very high belt forces
- sun cantileverd orsupported by carrier
- planets supported by three bearings? Or one planet cantileverd? or drive moment just applied by outer bearings, forces transmitted along carrier?
- sun or carrier fed coaxially through pulley?
## Forces
-> python notebook

[^1]: These are actually two advantages that can not be exploited by the more compact designs using ring gears.