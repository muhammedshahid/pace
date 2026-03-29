# 🤝 Contributing to PACE

Thank you for your interest in contributing to **PACE (Perceptual Adaptive Contrast Enhancement)** — a perceptually guided, structure-preserving image enhancement framework in Oklab space with adaptive multi-signal blending.

We welcome contributions from researchers, developers, and practitioners.

---

## 📌 Scope of Contributions

Contributions should align with one or more of the following:

- 🧪 Reproducibility (experiments, datasets, benchmarking scripts)
- 📊 Evaluation (metrics, baselines, statistical analysis)
- ⚙️ Core algorithm improvements (PACE pipeline, perceptual modeling, Oklab enhancements)
- 💻 Implementation enhancements (performance, modularity, browser/Node compatibility)
- 📖 Documentation improvements (clarity, examples, tutorials)
- 🧪 Testing and CI improvements

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/muhammedshahid/pace.git
cd pace
```

---

### 2. Install Dependencies & Build

```bash
npm install

# Build the library (required for local development and CLI)
npm run build
```

**Note:** Node.js 20 or later is recommended.

---

### 3. Run the Project

**Library usage:**

```js
import { applyPACE } from "pace";
// or
import { PACE } from "pace";

const output = await applyPACE(imageData, options);
```

**CLI usage:**

```bash
pace input.jpg output.png

# With options
pace input.jpg output.png --strength 0.8
pace input.jpg output.png --config config.json
pace input.jpg output.png --debug
```

You can also install globally:

```bash
npm install -g pace
```

---

## 🌿 Development Workflow

```bash
git checkout -b feature/your-feature-name
```

- Make your changes (keep them focused and modular)
- Test your changes:

```bash
npm test
npm run lint
npm run lint:fix
npm run build
```

- Commit your changes
- Open a Pull Request

---

## 🧪 Testing & Code Quality

Before every commit or PR, run:

```bash
npm test          # Unit and functional tests
npm run lint      # ESLint check
npm run lint:fix  # Auto-fix lint issues
npm run build     # Verify build
```

GitHub Actions CI will automatically run these checks on every pull request.

---

## ✅ Code Quality Guidelines

- Follow the existing code style defined in `eslint.config.js`
- Prefer small, composable, and well-documented functions
- Avoid adding unnecessary dependencies
- Maintain compatibility with both Node.js and browser environments
- Add clear comments for complex perceptual or color-science logic

---

## 🧪 Reproducibility Requirements (Important for Research & JOSS)

For any contribution involving experiments or evaluations:

- Clearly document dataset, preprocessing steps, and metrics
- Place scripts inside the `/reproducibility` folder
- Ensure deterministic execution (no hidden randomness)
- Include before/after images where helpful

---

## 📊 Benchmarking Contributions

- Include standard baselines (HE, CLAHE, Retinex, etc.)
- Report metrics consistently on the same test images
- Avoid cherry-picking results

---

## 📝 Commit Message Convention

Format:

```
type(scope): short description
```

Examples:

- feat(core): improve adaptive luminance scaling in Oklab
- fix(cli): resolve output path issue with --config
- docs: update CLI examples
- test: add deterministic test for strength parameter

---

## 📥 Pull Request Guidelines

Each PR should include:

- Clear title and description
- Motivation and problem addressed
- Before/after results or metrics (if applicable)
- Confirmation that tests, lint, and build all pass
- Update `CHANGELOG.md` if user-facing changes are introduced

Keep PRs small and focused.

---

## 🔍 Review Criteria

- Alignment with project goals (perceptual quality + reproducibility)
- Code clarity and quality
- Performance and compatibility impact
- Reproducibility of results

---

## 💬 Discussion Before Large Changes

For major features or architectural changes, open an Issue first.

---

## 📜 Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙌 Acknowledgment

All meaningful contributions will be credited in `CHANGELOG.md`, contributors list, and/or the associated research paper.

Thank you for helping make PACE better! 🚀