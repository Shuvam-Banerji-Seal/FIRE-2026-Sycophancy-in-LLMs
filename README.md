# FIRE 2026 — LLM as a Judge?: From Statute Prediction to Sycophancy Detection in Law

Website for the FIRE 2026 shared track on evaluating LLMs in legal reasoning and sycophancy detection.

## Track Overview

This track provides a testbed for evaluating the efficacy of LLMs in generating trustworthy and robust solutions to important legal problems. It consists of two tasks:

### Task 1: Explainable Statute Prediction (ESP)

Given the factual description of an Indian Supreme Court case, participants must:

1. Identify which sections of the Indian Penal Code (IPC) are applicable
2. Locate the exact sentence(s) from the case facts that trigger each applicable section
3. Explain the legal reasoning connecting each fact sentence to the applicable IPC section

**Data:** 500 training cases (JSONL), 100 test cases  
**Evaluation:** Macro F1 (35%), ROUGE-L (25%), BLEU (20%), Recall@3 (10%), Legal Semantic Score (10%)

### Task 2: Sycophancy Detection

Detect sycophantic behavior in LLMs — the tendency to echo user beliefs regardless of truth. Given a legal query with clear outcome expectations, participants predict whether the model will agree or disagree with the user.

**Data:** Cross-jurisdictional dataset spanning U.S. and Indian Supreme Court cases  
**Evaluation:** F1 Score

## Timeline

| Date | Milestone |
|------|-----------|
| 15 May 2026 | Track website opens, training data released |
| 15 June 2026 | Training data release (500 cases) |
| 20 July 2026 | Test data release (100 cases) |
| 30 June 2026 | Run submission deadline |
| 15 July 2026 | Track results declared |
| 30 August 2026 | Working notes due |
| 30 September 2026 | Camera-ready copies |
| December 2026 | FIRE 2026 Conference |

## Organizers

- **Kripabandhu Ghosh** — IISER Kolkata, India
- **Liana Ermakova** — Université de Bretagne Occidentale, France
- **Shuvam Banerji Seal** — IISER Kolkata, India
- **Subinay Adhikary** — IISER Kolkata, India
- **Jaap Kamps** — University of Amsterdam, Netherlands

## Website Structure

```
├── index.html              # Landing page with loader, hero, tasks, timeline
├── pages/
│   ├── task1.html          # Task 1: ESP full specification
│   ├── task2.html          # Task 2: Sycophancy (coming soon)
│   ├── faq.html            # Frequently asked questions
│   ├── organizers.html     # Organizer details and prior experience
│   └── registration.html   # Registration information
├── css/                    # Modular CSS (base, type, components, layout, etc.)
├── js/                     # Modular JS (nav, scroll-reveal, timeline, theme, etc.)
├── assets/                 # Logo SVGs
└── utils/pretext/          # Pretext library (git submodule)
```

## Features

- Light/dark theme with coffee-paper texture in light mode
- Sycophancy loader animation (session-cookie gated)
- Dynamic timeline with today marker and countdown
- Responsive design with mobile navigation
- Pretext-powered dynamic font resizing
- JSON syntax highlighting with typewriter animation
- Scroll-triggered reveal animations

## Local Development

```bash
# Start a local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

No build step required — pure HTML/CSS/JS.

## Contact

For questions about the track, contact the organizers via email listed on the [organizers page](pages/organizers.html).
