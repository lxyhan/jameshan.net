---
title: "A Model for Goal Setting"
pubDate: 2026-03-14
description: "A framework for understanding decision making"
tags: ["reflection", "philosophy"]
draft: true
---



*March 14, 2026*

There are three questions I wanted a model to answer: how do I decide what to work on, how do I know what *not* to do, and, given I know what to do, how do I actually do it effectively.

This is an attempt to build a framework for understanding my decisions from first principles.

---

## 1. Definition of a Goal

A goal has three components: a **want** (a desire for some state to be different), **steps** (a series of actions that move toward it), and an **outcome** (a well-defined state where it is achieved).

Scrolling Instagram is a goal. The want is the feeling of dopamine when I look at reels. The steps are picking up my phone, opening the app, and swiping. The outcome is that I have scrolled. Qualifying for Team Canada is also a goal. The want is the credential and what it represents. The steps are years of structured training. The outcome is making the team.

These two things have identical structure. There is no separate category for "distractions" or "wasted time." Every action I take is a goal being selected. 
The difference between these goals is not structural. It is in the properties described below.

---

## 2. Properties of a Goal

### Clarity

A clear goal has tangible steps, can be easily visualized, and has a definite start and end. Clarity falls on a spectrum.

High clarity: I'd like to go to the gym today. (Get clothes, go to gym, work out.)

Low clarity: I want to be athletically extraordinary at the national level. (Which event? How to train? How much time to dedicate?)


### Motivation

Motivation is how much I want to pursue a goal. A very boring task has near-zero motivation. Motivation is a psychological state, subject to rapid changes (music, exercise, mood).

### Probability of Success

Probability of success is the estimated chance that pursuing a goal actually results in the desired outcome. Going to the gym today: 99%. Qualifying for Team Canada: 40%. Getting hired at a frontier AI lab: 5%.

This is a property of the world, not a psychological state, which is why it is separated from motivation. It estimates how likely a goal is reached given that you have done everything you can.

### Alignment

Alignment captures how good achieving a goal actually is for me.

This requires an assumption: there exist many possible timelines, and my well-being across them is a function of wealth, happiness, health, and peace. A high alignment goal pushes me closer to outcomes near the top of that distribution. A low alignment goal pushes me toward the bottom. Negative alignment actively makes things worse.

Alignment is the hardest property to measure. It is also the only one that connects to actual long-term outcomes.

<aside>
The Non-Linearity of Alignment:

Some goals have alignment that increases linearly with effort. Others have alignment that jumps discontinuously at a threshold. Any goal with a binary qualification, a credential, a hire, a ship date, has a step function in its alignment curve.

Training is a good example. Baseline training (running a few times a week, lifting twice) has high alignment through health and mental clarity. Additional volume beyond that has diminishing returns. The curve flattens.

But at a qualification threshold, like making a national team, alignment jumps. You go from "someone who trains a lot" to "Team Canada athlete." The credential unlocks downstream value in career signaling, content authority, and social differentiation that did not exist one step below the threshold.

This means training "almost enough" to qualify is the lowest-EV position. You pay the cost of high volume but don't reach the threshold where credential alignment kicks in. Either commit to crossing the threshold or drop to baseline. The middle is where EV is lowest.
</aside>

### Expected Value (EV)

We define EV as a weighted product of motivation, alignment, and probability of success. This is a simplification: the true relationship between these inputs is not precisely multiplicative, and the inputs themselves are not on commensurable scales. The simplification is justified not because it is exact, but because the error it introduces is smaller than the error of having no model at all. A crude ordering beats intuition badly enough that the imprecision at the margins does not matter.

Under this definition:

- High EV goals have positive alignment, meaningful motivation, and reasonable probability.
- Low EV goals might have high motivation but low alignment, or low motivation but high alignment, or high alignment but very low probability.
- Zero EV goals are neutral.
- Negative EV goals have negative alignment and high motivation. They feel rewarding but produce negative outcomes.

- Asymmetric bets have low probability and high alignment. They are positive EV when the cost of the attempt is small relative to the potential payoff.

<aside>
I will eventually make the bold claim that 95%+ of most people's goals currently are negative EV
</aside>

---

## 3. The Priority Queue

A rational actor models goals as a priority queue sorted by EV. One goal at a time, selected from the top.

<aside>
Modelling Choice: we assume EV is the universal indicator of value. A higher EV goal is ALWAYS better than a low EV goal. It is not subject to perception, as that is already priced into alignment.
</aside>

The queue logic is never wrong. It is a sorting algorithm that always produces the correct ordering given its inputs. By defining it this way, all failure modes collapse into one category: input quality. Every bad decision is a bad input. You don't deliberate at the selection step. You take whatever is on top.

A blocked task is not abandoned. It is removed from the Queue temporarily and added back with its new properties once new information arises.

### Feedback Loops

Selecting from the queue changes it. These effects are complicated but I can explore some intuition. Completing a goal tends to increase motivation for similar tasks as you become more confident in your abilities. The queue re-sorts and those goals move higher. This is a positive feedback loop.

The inverse is also true. Failing or abandoning a goal repeatedly means that motivation eventually drops off for those tasks as you become less motivated to start (due to fear).

Some sets of goals have increasing marginal returns (compound interest) and then decrease. Increasing studying from 10 to 30 hours a week has high alignment, yet 30 to 50 has diminishing returns. As goals are actualized future goals' alignment can shift.

---

## 4. Distortions

The priority queue represents the ordering of goals by EV. This is a determinstic ordering in the universe that I don't have access to. What I actually select in practice is a percieved queue that stems from my mood, thoughts, systems, and even distoritions: factors that warp my perception of the scores or cause me to ignore the ordering entirely.

Let's explore a few distortions that can cause my personal queue to deviate from the true priority queue of goals.

<aside>
This is my 3rd time stating this, but this model assumes that the Queue is always correct. If there is a misalignment, it is already priced into the queue via our inputs.
</aside>

### False Inputs

False inputs fabricate goals or data that don't correspond to reality. The queue logic processes them correctly, but the inputs themselves are fake.

Example: OCD. Untreated, my OCD generated goals like "protect yourself from someone who is trying to harm you." That goal scores as extremely high motivation and extremely high alignment, because self-preservation is about as aligned as it gets. The queue correctly prioritized it. The problem was that the threat wasn't real. OCD was injecting fabricated data into the system.

Sertraline is an intervention that targets false inputs. It doesn't fix the queue logic. It fixes the data feed. It is not perfect, but the EV of my decision-making with it is higher than without it.

### Noisy Inputs

Noisy inputs introduce real but unpredictable perturbations to motivation, randomly reshuffling the queue in ways that can't be controlled or anticipated.

Example: Music. At 5-6 hours a day, music is not a discrete goal being selected. It is a persistent system-wide modifier on motivation. A song that hypes me up for training increases motivation on a high alignment goal. A song that makes me nostalgic and kills my drive to work decreases motivation on a high alignment goal. These shifts are real (they actually change EV, not just my perception of it) but they are unpredictable and untargeted. At that volume, music functions as an uncontrolled substance affecting psychological inputs that cascade through every decision. Unlike sertraline, it is not calibrated to correct a specific problem.

### Biased Inputs

Biased inputs systematically push selection in a suboptimal direction. Unlike noise, the bias is consistent and predictable. Unlike false inputs, the underlying signal is real. It is just weighted wrong.

Example: Ego. Ego skews the weights toward staying on the current path. It doesn't change motivation or alignment. It causes me to ignore the queue and stick with whatever I'm already doing, because switching feels like admitting the previous choice was wrong. This is a systematic bias toward inertia.

Another example: Instant gratification. I would penalize the motivation for two tasks with the same alignment and probability of success given that one is easier to do. This results in easy goals (which already have high motivation) to be amplified.

### Feedback Distortions (Procrastination)

Feedback distortions are not a single bad input but a compounding process. Each time a low EV goal is selected, motivation for high alignment tasks drops slightly, which lowers their EV, which makes them less likely to be selected again, which leads to another low EV selection. The queue progressively degrades through repeated bad selections.

Procrastination is the canonical example. It is not laziness. It is a negative feedback loop that systematically distorts the queue over time, causing high-alignment tasks to sink below low-alignment ones for extended periods.
The loop breaks when a deadline approaches. Deadlines change alignment directly: as the deadline gets closer, the cost of not completing the task increases, so alignment rises. Urgency is also motivating, so motivation rises with it. At some point EV becomes so high that it overwhelms every distortion in the system and the task finally gets selected.

This is the queue working correctly. The failure was not the deadline selection. That was optimal given the inputs at the time. The failure was the entire window before it, where the feedback loop kept a high-alignment task suppressed while lower-EV goals accumulated selections they did not deserve. The queue is not the problem. It is where the problem ends. Rather, every problem can be traced back to distorted inputs.

This is the key to this entire model: The queue is never wrong. Only the inputs.

---

## 5. Interventions

An intervention is anything that modifies the inputs to the priority queue.

False inputs require corrections to the data feed (e.g. sertraline correcting OCD). Noisy inputs require elimination or constraint of the noise source (e.g. reducing music exposure). Biased inputs require a counterweight to the systematic skew (e.g. some mechanism to counteract ego, currently undefined).

No intervention needs to fully solve its target distortion. It needs to make the queue less wrong than it would be without it.

## Next Steps

We now have the language to reason about goals. I will now build up towards heuristics for:
- What is an Effective Goal?
- How can I set an Effective Goal?
- Given a set of effective Goals, how do I minimize distortions?

And the most difficult of all:
- Increasing Motivation for goals
- How do I measure alignment