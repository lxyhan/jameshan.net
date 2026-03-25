---
title: "A Model for Goal Setting"
pubDate: 2026-03-14
description: "A framework for understanding decision making"
tags: ["reflection", "philosophy"]
draft: true
order: 1
---

*March 14, 2026*

There is one question I want a model to answer: what should I work on?

This is an attempt to build a framework for understanding my decisions from first principles.

---

## 1. Definition of a Goal

A goal has three components: a **want** (a desire for some state to be different), **steps** (a series of actions that move toward it), and an **outcome** (a well-defined state where it is achieved).

Scrolling Instagram is a goal. The want is the feeling of dopamine when I look at reels. The steps are picking up my phone, opening the app, and swiping. The outcome is that I have scrolled. Qualifying for Team Canada is also a goal. The want is the credential and what it represents. The steps are years of structured training. The outcome is making the team.

These two things have identical structure. There is no separate category for "distractions" or "wasted time." Every action I take is a goal being selected. The difference between these goals is not structural. It is in the properties described below.

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

One thing I keep coming back to is that alignment is not always smooth. Some goals have alignment that increases linearly with effort. Others jump discontinuously at a threshold. Any goal with a binary qualification (a credential, a hire, a ship date) has a step function in its alignment curve.[^1]

[^1]: Training is a good example. Baseline training (running a few times a week, lifting twice) has high alignment through health and mental clarity. Additional volume beyond that has diminishing returns. The curve flattens. But at a qualification threshold, like making a national team, alignment jumps. You go from "someone who trains a lot" to "Team Canada athlete." The credential unlocks downstream value in career signaling, content authority, and social differentiation that did not exist one step below the threshold. This means training "almost enough" to qualify is the lowest-value position. You pay the cost of high volume but don't reach the threshold where credential alignment kicks in. Either commit to crossing the threshold or drop to baseline. The middle is where value is lowest.

### Ranking Goals

Given these properties, I need some way to compare goals against each other. The instinct is to reach for something precise (multiply motivation by alignment by probability, call it expected value) but I don't think that's honest. These inputs aren't on commensurable scales. I can't put a number on alignment. Motivation shifts hourly.

What I can do is use these properties as a rough ordering heuristic. Given two goals, I can ask: which one has better alignment? Which one has a more realistic probability? Which one am I actually motivated to pursue? The answers won't be exact, but they produce an ordering, and a crude ordering beats having no model at all.

Under this heuristic:

- High-value goals have positive alignment, meaningful motivation, and reasonable probability.
- Low-value goals might have high motivation but low alignment, or high alignment but very low probability.
- Negative-value goals have negative alignment and high motivation. They feel rewarding but produce negative outcomes.
- Asymmetric bets have low probability and high alignment. They are positive value when the cost of the attempt is small relative to the potential payoff.

I think 95%+ of most people's goals are probably negative value. I'll come back to this.[^2]

[^2]: This is a bold claim and I'm not fully confident in it yet. But when I look at how I spend my own time, the proportion of hours going toward goals with genuinely positive alignment is disturbingly small. Most of the day is consumed by things that feel good in the moment but produce nothing.

---

## 3. The Priority Queue

A rational actor would model goals as a priority queue sorted by value. One goal at a time, selected from the top.[^3]

[^3]: This is a modelling choice: I'm assuming the ranking is the universal indicator of value. A higher-ranked goal is always better than a lower-ranked one. This is not subject to perception, because perception is already priced into the inputs (motivation is a perception, alignment tries to account for it).

The queue logic is never wrong. It is a sorting algorithm that always produces the correct ordering given its inputs. By defining it this way, all failure modes collapse into one category: input quality. Every bad decision is a bad input. You don't deliberate at the selection step. You take whatever is on top.

A blocked task is not abandoned. It is removed from the queue temporarily and added back with its new properties once new information arises.

### Feedback Loops

Selecting from the queue changes it. These effects are complicated but I can explore some intuition. Completing a goal tends to increase motivation for similar tasks as you become more confident in your abilities. The queue re-sorts and those goals move higher. This is a positive feedback loop.

The inverse is also true. Failing or abandoning a goal repeatedly means that motivation eventually drops off for those tasks as you become less motivated to start (due to fear).

Some sets of goals have increasing marginal returns (compound interest) and then decrease. Increasing studying from 10 to 30 hours a week has high alignment, yet 30 to 50 has diminishing returns. As goals are actualized, future goals' alignment can shift.

---

## 4. Distortions

The priority queue represents the ordering of goals by value. This is a deterministic ordering in the universe that I don't have access to. What I actually select in practice is a perceived queue that stems from my mood, thoughts, systems, and distortions: factors that warp my perception of the scores or cause me to ignore the ordering entirely.[^4]

[^4]: This is my third time stating this, but the model assumes the queue is always correct. If there is a misalignment, it is already priced into the queue via the inputs.

### False Inputs

False inputs fabricate goals or data that don't correspond to reality. The queue logic processes them correctly, but the inputs themselves are fake.

Example: OCD. Untreated, my OCD generated goals like "protect yourself from someone who is trying to harm you." That goal scores as extremely high motivation and extremely high alignment, because self-preservation is about as aligned as it gets. The queue correctly prioritized it. The problem was that the threat wasn't real. OCD was injecting fabricated data into the system.

Sertraline is an intervention that targets false inputs. It doesn't fix the queue logic. It fixes the data feed. It is not perfect, but my decision-making with it is better than without it.

### Noisy Inputs

Noisy inputs introduce real but unpredictable perturbations to motivation, randomly reshuffling the queue in ways that can't be controlled or anticipated.

Example: Music. At 5-6 hours a day, music is not a discrete goal being selected. It is a persistent system-wide modifier on motivation. A song that hypes me up for training increases motivation on a high alignment goal. A song that makes me nostalgic and kills my drive to work decreases motivation on a high alignment goal. These shifts are real (they actually change the ordering, not just my perception of it) but they are unpredictable and untargeted. At that volume, music functions as an uncontrolled substance affecting psychological inputs that cascade through every decision. Unlike sertraline, it is not calibrated to correct a specific problem.

### Biased Inputs

Biased inputs systematically push selection in a suboptimal direction. Unlike noise, the bias is consistent and predictable. Unlike false inputs, the underlying signal is real. It is just weighted wrong.

Example: Ego. Ego skews the weights toward staying on the current path. It doesn't change motivation or alignment. It causes me to ignore the queue and stick with whatever I'm already doing, because switching feels like admitting the previous choice was wrong. This is a systematic bias toward inertia.

Another example: Instant gratification. I penalize two tasks with the same alignment and probability of success if one is easier to do. This results in easy goals (which already have high motivation) being amplified.

### Feedback Distortions (Procrastination)

Feedback distortions are not a single bad input but a compounding process. Each time a low-value goal is selected, motivation for high alignment tasks drops slightly, which lowers their ranking, which makes them less likely to be selected again, which leads to another low-value selection. The queue progressively degrades through repeated bad selections.

Procrastination is the canonical example. It is not laziness. It is a negative feedback loop that systematically distorts the queue over time, causing high-alignment tasks to sink below low-alignment ones for extended periods.

The loop breaks when a deadline approaches. Deadlines change alignment directly: as the deadline gets closer, the cost of not completing the task increases, so alignment rises. Urgency is also motivating, so motivation rises with it. At some point the ranking becomes so high that it overwhelms every distortion in the system and the task finally gets selected.

This is the queue working correctly. The failure was not the deadline selection. That was optimal given the inputs at the time. The failure was the entire window before it, where the feedback loop kept a high-alignment task suppressed while lower-value goals accumulated selections they did not deserve. The queue is not the problem. It is where the problem ends. Every problem can be traced back to distorted inputs.

This is the key to this entire model: the queue is never wrong. Only the inputs.

---

## 5. Interventions

An intervention is anything that modifies the inputs to the priority queue.

False inputs require corrections to the data feed (e.g. sertraline correcting OCD). Noisy inputs require elimination or constraint of the noise source (e.g. reducing music exposure). Biased inputs require a counterweight to the systematic skew (e.g. some mechanism to counteract ego, currently undefined).

No intervention needs to fully solve its target distortion. It needs to make the queue less wrong than it would be without it.

---

## 6. Open Questions

This model gives me language for reasoning about goals. What it does not yet address:

- Alignment is doing most of the work, and I have no reliable method for measuring it. The entire framework depends on a variable I cannot quantify.
- The non-linearity of alignment (noted above) suggests that the structure of value across outcomes is itself worth examining. I explore this in the [next piece](/effective-goal-setting/fat_tails_in_value).
- Motivation as an input risks circularity. If I select by ranking and motivation is part of the ranking, the model may be restating "I do what I feel like doing" with additional formalism.
- The queue being "never wrong" is unfalsifiable by construction. Any bad outcome is attributed to bad inputs. This is useful as a modelling assumption but should not be mistaken for a claim about reality.
