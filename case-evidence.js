/* Case evidence: recorded results, not rerun experiments. See SOURCE_MAP.json. */
const caseData = {
  "jobfit": {
    "summary": "JobFit helps early-career candidates inspect job requirements against evidence in their CV, with traceable quotes and explicit gaps.",
    "subtitle": "From noisy job postings to evidence-grounded matching",
    "exploration": [
      {
        "question": "Does an AI title identify an AI role?",
        "finding": "49 of 463 AI-containing titles fell outside the study’s target-role rules. The collection funnel separates 1,314 API slots, 937 exact-key clusters, 910 estimated jobs, 632 analytical candidates and 428 target roles.",
        "population": "JSearch snapshot CP1_20260926; query-based corpus, not the whole job market.",
        "decision": "Separate job identity, role-family classification and eligibility; keep comparison roles for testing difficult negatives.",
        "limitation": "Rule-based labels were not separately scored against a gold role-label set.",
        "sourcePaths": [
          "notebooks/01_research.ipynb#cell-993bc42a",
          "data/processed/CP1_research_summary.json"
        ]
      },
      {
        "question": "Can an unspecified title safely pass the experience filter?",
        "finding": "128 of 405 analytical candidates without a title-level marker still contain a 3+ year experience signal.",
        "population": "632 analytical candidates; the 405 denominator is the unspecified-title subset.",
        "decision": "Use job-description experience evidence as a separate signal instead of relying on the word junior.",
        "limitation": "A stated requirement is not proof of eligibility; multi-level and preferred requirements need careful interpretation.",
        "sourcePaths": [
          "notebooks/01_research.ipynb#cell-4b508e84",
          "docs/checkpoint_1/CP1_06_Insights_and_Design_Decisions.md"
        ]
      },
      {
        "question": "What should missing requirements mean?",
        "finding": "Among 175 Indonesian target jobs, 49 had entry/≤2-year signals while 57 left experience unstated.",
        "population": "Indonesian target-role subset only.",
        "decision": "Keep UNKNOWN explicit and distinguish qualification from preference. Do not treat an unstated value as a match.",
        "limitation": "This is an experience-screen pool, not a verified count of jobs a candidate can obtain.",
        "sourcePaths": [
          "notebooks/01_research.ipynb#cell-8ee40936",
          "data/processed/CP1_research_summary.json"
        ]
      },
      {
        "question": "Is a copied quote sufficient evidence of a correct match?",
        "finding": "The scoring implementation checks source quotes and can hold results when required items cannot be assessed. A text-valid quote can still support an incorrect semantic interpretation.",
        "population": "Requirement-level matching and deterministic scoring.",
        "decision": "Show requirement labels, source quotes, constraints and held states alongside evidence coverage.",
        "limitation": "The score is evidence coverage, not a hiring probability; quote validity is separate from semantic match quality.",
        "sourcePaths": [
          "src/jobfit/scoring/score.py",
          "src/jobfit/matching/quote_check_v11.py"
        ]
      },
      {
        "question": "Should a prompt with fewer unsupported positives replace the baseline?",
        "finding": "The development challenger QA-E02 reduced unsupported positives but exceeded the locked underclaim limit. The selection artifact records no eligible challenger.",
        "population": "Development-only prompt study, separate from CV3–CV5 held-out testing.",
        "decision": "Keep evidence prompt v1.1; preserve the precision/recall trade-off as a future hypothesis.",
        "limitation": "The study used synthetic profiles and AI-assisted labels. The unrun confirmation subset cannot establish an improvement.",
        "sourcePaths": [
          "evals/results/quality_optimization/analysis/wave1_selection_v1.json",
          "docs/checkpoint_2/CP2_08_Post_Test_Quality_Optimization.md"
        ]
      }
    ],
    "experiments": [
      "The frozen CP2 evaluation compares stage-1 retrieval order with final product order, including deterministic seniority rules, model fallback and held results.",
      "P@5 covers CV3–CV5. Paired NDCG@10 covers CV3 and CV4 only; CV5 contains an unjudged result and is not assigned zero.",
      "A subsequent development-only prompt study retained baseline v1.1. It does not replace or rerun the held-out result."
    ],
    "results": [
      {
        "metric": "Stage-1 P@5 macro",
        "value": 0.5333333333333333,
        "unit": "ranking score",
        "split": "Held-out synthetic CV profiles (CV3–CV5)",
        "sampleSize": 3,
        "modelVersion": "cp24_test_v1 / frozen D-087",
        "evidenceStatus": "recorded",
        "sourcePath": "evals/results/cp24/heldout_report_v1.json",
        "context": "CV3, CV4 and CV5; one recorded run per synthetic profile.",
        "decimals": 4,
        "displayLabel": "Search-order baseline · CP2",
        "sampleUnit": "profiles"
      },
      {
        "metric": "Final P@5 macro",
        "value": 0.7333333333333334,
        "unit": "ranking score",
        "split": "Held-out synthetic CV profiles (CV3–CV5)",
        "sampleSize": 3,
        "modelVersion": "cp24_test_v1 / frozen D-087",
        "evidenceStatus": "recorded",
        "sourcePath": "evals/results/cp24/heldout_report_v1.json",
        "context": "Same three profiles; final order includes fallback and holds.",
        "decimals": 4,
        "displayLabel": "Final ranking · CP2",
        "sampleUnit": "profiles"
      },
      {
        "metric": "Stage-1 NDCG@10 macro",
        "value": 0.8046813601460272,
        "unit": "ranking score",
        "split": "Eligible held-out synthetic CV profiles (CV3–CV4)",
        "sampleSize": 2,
        "modelVersion": "cp24_test_v1",
        "evidenceStatus": "recorded",
        "sourcePath": "evals/results/cp24/heldout_report_v1.json",
        "context": "CV3 and CV4 only; same denominator as final NDCG.",
        "decimals": 4,
        "displayLabel": "Search-order baseline · CP2",
        "sampleUnit": "profiles"
      },
      {
        "metric": "Final NDCG@10 macro",
        "value": 0.9604050613677055,
        "unit": "ranking score",
        "split": "Eligible held-out synthetic CV profiles (CV3–CV4)",
        "sampleSize": 2,
        "modelVersion": "cp24_test_v1",
        "evidenceStatus": "recorded",
        "sourcePath": "evals/results/cp24/heldout_report_v1.json",
        "context": "CV5 omitted because F00070 is unjudged; not model accuracy.",
        "decimals": 4,
        "displayLabel": "Final ranking · CP2",
        "sampleUnit": "profiles"
      }
    ],
    "workflow": [
      {
        "label": "Current serving implementation",
        "flow": [
          "Upload → local sanitizer",
          "Review exact text → consent",
          "Parse → Find Jobs (search order)",
          "Choose a job → requirement extraction",
          "Evidence matching → quote checks",
          "Evidence coverage, holds and CV guidance"
        ]
      },
      {
        "label": "Historical CP2 benchmark",
        "flow": [
          "Synthetic held-out CV",
          "Hybrid retrieval + seniority rule",
          "Analyze top candidates with fallback",
          "Final product order",
          "Paired ranking evaluation"
        ]
      }
    ],
    "lessons": [
      "Small synthetic benchmarks need visible denominators and label-provenance limitations.",
      "A citation check verifies text provenance, while semantic correctness needs separate evaluation.",
      "Current uploaded-CV behavior is not independently evaluated by the historical ranking headline."
    ],
    "nextSteps": [
      "Evaluate on a broader, independently reviewed profile set.",
      "Measure semantic evidence errors separately from quote checks.",
      "Test the direct-evidence prompt hypothesis on a separately defined development/confirmation protocol."
    ],
    "delivery": "FastAPI and Streamlit code separate search from per-job analysis and implement sanitizer/consent gates. The newer canonical README documents a VPS demo behind HTTP Basic Auth, with access on request. Live availability and credentials were not tested during this portfolio audit.",
    "sources": [
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "README.md",
        "section": "Features; Results; How it works; Architecture and deployment; demo access",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/README.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "f814020ac77388d5669c123cad63653eb859c4834757a7929d852a6d8c247a69",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "data/processed/CP1_research_summary.json",
        "section": "funnel; ai_title_not_target; populations; title_unspecified_3plus; experience_bucket_ID_T",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/data/processed/CP1_research_summary.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "7ede0e07b75ac61800e20a2dad86791e5588a5a10d2abd912a30e59e736e0e70",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "docs/checkpoint_1/CP1_06_Insights_and_Design_Decisions.md",
        "section": "sections 2–4; CP1 findings versus proposed decisions",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/docs/checkpoint_1/CP1_06_Insights_and_Design_Decisions.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "bedd7323833b98114fdefc47098ecd7fe06962433695dc578bf58c3b6c9b3080",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "docs/checkpoint_2/CP2_04_Evaluation_Metrics.md",
        "section": "sections 9–10; held-out coverage and limitations",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/docs/checkpoint_2/CP2_04_Evaluation_Metrics.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "c23b32143ee38b0e39b152077ce6b71f0f9c9b845b4d459fb4cb892ea656fc9e",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "docs/checkpoint_2/CP2_08_Post_Test_Quality_Optimization.md",
        "section": "sections 2–12; development-only selection and KEEP BASELINE",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/docs/checkpoint_2/CP2_08_Post_Test_Quality_Optimization.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "0c2b99864fb8bd4bba8343d8944e44a3fd6ae14710332ce8d0a0c63a9126ebd4",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "evals/results/cp24/heldout_report_v1.json",
        "section": "primary_heldout; per_cv; rules",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/evals/results/cp24/heldout_report_v1.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "b446f2dceec9e20fa8f1a0fb04acf46b75d0b6706aa88e7edef6283d028c004e",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "evals/results/quality_optimization/analysis/wave1_selection_v1.json",
        "section": "cards; provisional_finalist; decision",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/evals/results/quality_optimization/analysis/wave1_selection_v1.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "45ea746c3766e652cd39454933175ede2b0ee14b90d26aea677b129f96cdc328",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "notebooks/01_research.ipynb",
        "section": "cells 5,7,32,34,43,47,53,55: source, saved text outputs and execution counts; adjacent markdown",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/notebooks/01_research.ipynb",
        "readStatus": "read (scope stated in section)",
        "sha256": "5b7f0bd6a81514d315ccdd0c8f391d4f208a98075b86f39c8871e3dcf1f94b99",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "notebooks/02_cp2_heldout_evaluation.ipynb",
        "section": "cells 2,4,7,10,15,18 source/output/execution; adjacent markdown",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/notebooks/02_cp2_heldout_evaluation.ipynb",
        "readStatus": "read (scope stated in section)",
        "sha256": "2584fc3b2dd5f1070fc98bc176da4313b4196282699f24d3654e40e972f8886c",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "notebooks/03_post_test_quality_optimization.ipynb",
        "section": "cells 2,6,10,16,20,24,26; source/output/execution; selection checked against JSON",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/notebooks/03_post_test_quality_optimization.ipynb",
        "readStatus": "read (scope stated in section)",
        "sha256": "e3f61c0e1a5c1be9f4b8efefe1468e6e0e344cf7615971b8ba58ef6c6ac4e77d",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "src/jobfit/scoring/score.py",
        "section": "compute_score; PARTIAL_WEIGHT; exclusions and hold states",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/src/jobfit/scoring/score.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "db6745da06d09bfc9f01da4217815643a1eb20d308b01a39284ffd2beb064692",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "src/jobfit/matching/quote_check_v11.py",
        "section": "resolve_quote; normalize_assessments_v11",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/src/jobfit/matching/quote_check_v11.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "8913ddc5dbfccbe81549a69f1335abbe080290354db8c449e9a7b91e673c3bdc",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/Job-Fit",
        "path": "src/jobfit/api/main.py",
        "section": "implementation excerpts: consented_lease, _set_preview, real-CV routes; not complete module review",
        "ref": "2ab2948eea6406c0f71ac4ffe519aa21547f2a68",
        "url": "https://github.com/Gidion123/Job-Fit/blob/2ab2948eea6406c0f71ac4ffe519aa21547f2a68/src/jobfit/api/main.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "53e8f12930902137d38926eb62ffdf952cdac21ea55bb39298c20ab1fc69b198",
        "workingTreeStatus": "clean"
      }
    ],
    "checkedAt": "2026-10-15",
    "contribution": "I worked on corpus exploration, role and experience rules, retrieval and evidence matching, evaluation, and the API/UI workflow. The current serving implementation is distinct from the frozen CP2 experiment."
  },
  "stock-rag": {
    "summary": "A research assistant that retrieves source passages from Indonesian stock PDFs and separates cited document answers from deterministic market-data calculations.",
    "subtitle": "Retrieval quality, source traceability and honest evaluation boundaries",
    "exploration": [
      {
        "question": "What should enter the searchable corpus?",
        "finding": "The current corpus has 5 PDFs, 117 source pages, 105 retained pages and 489 chunks. Bibliography handling removes reference material while source/page metadata remains attached.",
        "population": "Current five-document index; counts differ from historical 308- and 527-chunk versions.",
        "decision": "Clean reference material before embedding, preserve page provenance, and assign content-addressed chunk IDs.",
        "limitation": "Cleaning cannot verify the financial claims inside research documents.",
        "sourcePaths": [
          "src/preprocessing.py",
          "docs/EVALUATION_AUDIT_2026-09-27.md"
        ]
      },
      {
        "question": "Does a compound question need more context or more diverse context?",
        "finding": "The early FAISS notebook reached keyword coverage on 4/4 in-scope questions with MMR k=6 or similarity k=12. Similarity k=4–10 reached 3/4.",
        "population": "One-document micro-experiment; four in-scope questions with expected-keyword coverage.",
        "decision": "Use this as a small exploratory comparison, then evaluate retrieval on a fingerprinted question/gold set.",
        "limitation": "This is neither the current PgVector runtime nor a universal MMR advantage.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-b67a14ad",
          "notebooks/01_experiment.ipynb#cell-bae57b4a"
        ]
      },
      {
        "question": "Would neighboring chunks repair missing continuation evidence?",
        "finding": "On benchmark C, the neighbor candidate reduced HitRate@8 from 0.8571 to 0.7500 and MRR from 0.4712 to 0.4477. It recovered one hit but lost four.",
        "population": "Same fingerprint eeae64b5f63f, 28 in-scope questions from 33 total.",
        "decision": "Reject the candidate and keep the baseline; inspect wording sensitivity and fragmented table/paragraph context.",
        "limitation": "A plausible error explanation is not enough to justify a retrieval change.",
        "sourcePaths": [
          "evaluation/results/retrieval_experiment.json",
          "docs/EVALUATION_AUDIT_2026-09-27.md"
        ]
      },
      {
        "question": "Does the evaluation retriever match the browser path?",
        "finding": "The UI session retriever prioritizes subject mentions within wider candidates and filters uploads by owner and expiry. Its empty-session comparison records HitRate@8 0.7500 and MRR 0.5381.",
        "population": "Existing UI path versus CLI similarity path on the same benchmark C questions.",
        "decision": "Report both paths explicitly and apply session filters before ranking.",
        "limitation": "Continuation passages without ticker text can be deprioritized; the CLI headline does not describe every UI session.",
        "sourcePaths": [
          "src/retriever.py",
          "evaluation/results/retrieval_experiment.json"
        ]
      }
    ],
    "experiments": [
      "Early notebook experiments use FAISS and a small question set; current implementation uses PostgreSQL/pgvector.",
      "Benchmark C contains 33 questions: 28 in scope and 5 out of scope, fingerprint eeae64b5f63f. It is a development benchmark.",
      "The same-page neighbor experiment was rejected. Existing runtime retrieval was not replaced."
    ],
    "results": [
      {
        "metric": "Similarity HitRate@8",
        "value": 0.8571428571428571,
        "unit": "fraction of questions with a gold-chunk hit",
        "split": "development benchmark C, in-scope",
        "sampleSize": 28,
        "modelVersion": "eeae64b5f63f; similarity k=8",
        "evidenceStatus": "recorded",
        "sourcePath": "evaluation/results/retrieval_results.json",
        "context": "28 scored in-scope questions; 33 total including 5 out-of-scope. Retrieval, not factual-answer accuracy.",
        "decimals": 4,
        "displayLabel": "Similarity retrieval · k=8",
        "sampleUnit": "in-scope questions"
      },
      {
        "metric": "Similarity Recall@8",
        "value": 0.5693452380952381,
        "unit": "mean fraction of gold chunks retrieved",
        "split": "development benchmark C, in-scope",
        "sampleSize": 28,
        "modelVersion": "eeae64b5f63f; similarity k=8",
        "evidenceStatus": "recorded",
        "sourcePath": "evaluation/results/retrieval_results.json",
        "context": "Macro average over questions; 80 question–chunk associations.",
        "decimals": 4,
        "displayLabel": "Similarity retrieval · k=8",
        "sampleUnit": "in-scope questions"
      },
      {
        "metric": "Similarity MRR@8",
        "value": 0.47117346938775506,
        "unit": "mean reciprocal rank",
        "split": "development benchmark C, in-scope",
        "sampleSize": 28,
        "modelVersion": "eeae64b5f63f; similarity k=8",
        "evidenceStatus": "recorded",
        "sourcePath": "evaluation/results/retrieval_results.json",
        "context": "First gold-chunk rank within the returned top eight; missing hit contributes zero.",
        "decimals": 4,
        "displayLabel": "Similarity retrieval · k=8",
        "sampleUnit": "in-scope questions"
      }
    ],
    "workflow": [
      {
        "label": "Current ingestion implementation",
        "flow": [
          "PDF pages",
          "Reference cleaning + source/page metadata",
          "500-character chunks / 80 overlap",
          "Multilingual embeddings",
          "PostgreSQL + pgvector"
        ]
      },
      {
        "label": "Current retrieval implementation",
        "flow": [
          "Question + session context",
          "Route research or market-data request",
          "Curated search + owner-scoped temporary search",
          "Rank context → cited answer",
          "Python calculations on market-data paths"
        ]
      }
    ],
    "lessons": [
      "Keyword coverage and citation presence do not establish claim-level factual correctness.",
      "Dataset fingerprints prevent changes in questions or gold from looking like model improvements.",
      "UI-specific retrieval deserves its own evaluation, including continuation passages."
    ],
    "nextSteps": [
      "Evaluate a fresh question set with independent claim-level answer review.",
      "Test continuation-aware retrieval while preserving the same comparison fingerprint.",
      "Exercise session retrieval and memory in a separate realistic benchmark."
    ],
    "delivery": "The code implements PgVector retrieval with session-owner/expiry filters and source metadata. The README records VPS hosting and monitoring. Live health, service behavior and long-term availability were not independently rechecked during this portfolio build.",
    "sources": [
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "README.md",
        "section": "Example Corpus; architecture; Evaluation Results; limitations",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/README.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "be76cf8496c0a408ac6252c28f822339bc638de2137ac7acf1ba8e3387f03b3f",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "docs/EVALUATION_AUDIT_2026-09-27.md",
        "section": "benchmark versions; root causes; rejected experiment; answer limitations",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/docs/EVALUATION_AUDIT_2026-09-27.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "b25dc314a836d4bacf6a4d6b47244dd97fad127b4f775b50cd3293fe55ad991e",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "evaluation/results/retrieval_results.json",
        "section": "config, fingerprint, counts, chunk_level and representative details",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/evaluation/results/retrieval_results.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "17c233d419f41cb95e11d8e14a57df68d7098568f11f10f95bf710e7ae80cbbe",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "evaluation/results/retrieval_experiment.json",
        "section": "candidate_description; baseline/candidate/existing_session chunk_level; gained/lost IDs",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/evaluation/results/retrieval_experiment.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "f52f52446b12292f3e52f2b165f8a3bf638d30f7e3f126b2914f6cae584d6f6c",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "evaluation/baselines/full_corpus_33/manifest.json",
        "section": "label; retrieval_fingerprint; runtime_retrieval_changed",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/evaluation/baselines/full_corpus_33/manifest.json",
        "readStatus": "read (scope stated in section)",
        "sha256": "58643f947bbc4c3c689e9ba887c0315b8c8cd45d414c5f5d90015256f667cdb6",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "notebooks/01_experiment.ipynb",
        "section": "sections outline; source, saved outputs and execution state of cells 35–49, especially 40/42/44/47",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/notebooks/01_experiment.ipynb",
        "readStatus": "read (scope stated in section)",
        "sha256": "4a76094c2e922cc0ef62348c3954c401e1b43350a9b32508dba32c33b5b36a7b",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "src/retriever.py",
        "section": "get_retriever; retrieve_documents; SessionRetriever.invoke; observed wrapper",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/src/retriever.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "e9c284317ff442ffffd8f746542034c76b095111608a5fcaec13fa3e383e2f9b",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "src/preprocessing.py",
        "section": "clean_text; reference-page/bibliography handling; load_pdf; stable_chunk_id; split_documents",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/src/preprocessing.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "be108103ee811c97006432b3c89194a91b45669b8bc24fbd9aedbf4b1c4403a4",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/indonesia-stock-research-assistant",
        "path": "src/evaluation.py",
        "section": "chunk_metrics; dataset_fingerprint; evaluate_retrieval",
        "ref": "1f9c4d82527cc8318dc850c1dddfcbc434871afb",
        "url": "https://github.com/Gidion123/indonesia-stock-research-assistant/blob/1f9c4d82527cc8318dc850c1dddfcbc434871afb/src/evaluation.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "e8ea2f5e1284fef6e541ba2f52c785beb59b48dc0da7926e02325ba6388ec57d",
        "workingTreeStatus": "clean"
      }
    ],
    "checkedAt": "2026-10-15",
    "contribution": "I explored PDF preparation and retrieval choices, then implemented a document-grounded assistant with session retrieval and observable application paths."
  },
  "house-mlops": {
    "summary": "An Ames Housing regression study translated into a documented API contract, reusable preprocessing and serving/monitoring scaffolding.",
    "subtitle": "Model selection shaped by missing-data semantics and serving constraints",
    "exploration": [
      {
        "question": "Is every pandas NaN genuinely missing information?",
        "finding": "Default parsing showed 872 NaN values in MasVnrType; raw-string inspection separated 864 literal None values from 8 NA tokens.",
        "population": "1,460 labeled Ames Housing rows; raw input parsing audit.",
        "decision": "Read CSV missing tokens explicitly and preserve meaningful categories before deciding feature-specific treatment.",
        "limitation": "Structural absence and unknown information are distinct, but the final serving pipeline still uses its documented imputation rules.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-db47d796",
          "src/data/data_loader.py"
        ]
      },
      {
        "question": "Would deleting incomplete rows create a usable training set?",
        "finding": "Calling dropna() on the initial 1,168-row training split left zero rows. The training target skewness was 1.743.",
        "population": "Initial random training split, separate from the holdout.",
        "decision": "Use feature-specific preparation and learned train/fold imputations; compare models on a log-transformed target.",
        "limitation": "Exploratory statistics alone do not prove a transform improves generalization.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-3b117f89",
          "notebooks/01_experiment.ipynb#cell-01f27d76",
          "src/data/data_preprocessor.py"
        ]
      },
      {
        "question": "Which inputs can a user provide before a transaction?",
        "finding": "The serving contract uses 20 user fields and 3 derived features; MoSold, YrSold, SaleType and SaleCondition are excluded.",
        "population": "Serving-contract study in section 13, distinct from the earlier broad-feature model.",
        "decision": "Build derived features only from available API inputs and keep preprocessing in a shared artifact pipeline.",
        "limitation": "Changing the feature contract changes the model comparison; the broad-feature score is a separate stage.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-24d47136",
          "src/data/data_preprocessor.py",
          "README.md"
        ]
      },
      {
        "question": "Are train and holdout rows still distinct under the smaller contract?",
        "finding": "Two holdout rows matched training rows across all 20 contract fields. Removing these overlap rows reduced the evaluated holdout from 292 to 290.",
        "population": "Section 13 feature-signature check; training remained 1,168 rows.",
        "decision": "Compare identities using the actual model inputs and disclose the evaluated subset.",
        "limitation": "The earlier section 11 had already evaluated the broad-feature holdout; this is not a globally untouched holdout.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-74004cb1",
          "src/data/data_loader.py"
        ]
      },
      {
        "question": "Does a small blend improvement justify a second model?",
        "finding": "With the same API features and five folds, an 80/20 XGBoost–LightGBM blend recorded CV RMSE_log 0.12522 versus 0.12581 for single XGBoost: about 0.47% lower.",
        "population": "Same-contract cross-validation on the training split.",
        "decision": "Keep single XGBoost because the improvement falls below the stated 1% complexity threshold.",
        "limitation": "The threshold is a project decision, not a test of statistical significance.",
        "sourcePaths": [
          "notebooks/01_experiment.ipynb#cell-49042f9f"
        ]
      }
    ],
    "experiments": [
      "The broad-feature experiment in section 11 records R² 0.90421 on 292 rows. Section 13 changes the model contract and evaluated subset, so the two R² values are not a controlled improvement comparison.",
      "The serving-contract blend comparison uses identical folds and features; single XGBoost is retained under the complexity rule.",
      "The serving-contract holdout is evaluated before a recorded final retrain on all 1,460 labeled rows. The holdout result does not independently evaluate that retrained artifact."
    ],
    "results": [
      {
        "metric": "Serving-contract holdout R²",
        "value": 0.92599,
        "unit": "R²",
        "split": "section 13 holdout after feature-overlap removal",
        "sampleSize": 290,
        "modelVersion": "single XGBoost / 20-field API contract",
        "evidenceStatus": "recorded",
        "sourcePath": "notebooks/01_experiment.ipynb#cell-3b4bcf75",
        "context": "Recorded rounded output; not percent accuracy. Earlier section 11 evaluated a different broad-feature candidate.",
        "decimals": 5,
        "displayLabel": "Single XGBoost · 20-field contract",
        "sampleUnit": "rows"
      },
      {
        "metric": "Serving-contract holdout MAE",
        "value": 15439.67,
        "unit": "USD",
        "split": "section 13 holdout after feature-overlap removal",
        "sampleSize": 290,
        "modelVersion": "single XGBoost / 20-field API contract",
        "evidenceStatus": "recorded",
        "sourcePath": "notebooks/01_experiment.ipynb#cell-3b4bcf75",
        "context": "Historical Ames Housing price scale; recorded saved output, not present-day valuation error.",
        "decimals": 2,
        "displayLabel": "Single XGBoost · 20-field contract",
        "sampleUnit": "rows"
      },
      {
        "metric": "Serving-contract holdout RMSE_log",
        "value": 0.13139,
        "unit": "log1p(price) units",
        "split": "section 13 holdout after feature-overlap removal",
        "sampleSize": 290,
        "modelVersion": "single XGBoost / 20-field API contract",
        "evidenceStatus": "recorded",
        "sourcePath": "notebooks/01_experiment.ipynb#cell-3b4bcf75",
        "context": "Recorded saved output; evaluated before all-data retraining.",
        "decimals": 5,
        "displayLabel": "Single XGBoost · 20-field contract",
        "sampleUnit": "rows"
      },
      {
        "metric": "Single-model CV RMSE_log",
        "value": 0.12581,
        "unit": "log1p(price) units",
        "split": "five-fold cross-validation on training",
        "sampleSize": 1168,
        "modelVersion": "single XGBoost / 20-field API contract",
        "evidenceStatus": "recorded",
        "sourcePath": "notebooks/01_experiment.ipynb#cell-49042f9f",
        "context": "Fold standard deviation 0.01548; not an uncertainty interval for future property prices.",
        "decimals": 5,
        "displayLabel": "Single XGBoost · 20-field contract",
        "sampleUnit": "rows"
      }
    ],
    "workflow": [
      {
        "label": "Recorded model-development workflow",
        "flow": [
          "Explicit CSV parsing",
          "Train/holdout split",
          "Contract identity check",
          "Train/fold preprocessing",
          "Same-contract CV + complexity rule",
          "Holdout evaluation → all-data retrain"
        ]
      },
      {
        "label": "Serving implementation overview",
        "flow": [
          "Streamlit request",
          "FastAPI contract",
          "Shared feature preparation",
          "Model bundle dependency",
          "Prediction + monitoring"
        ]
      }
    ],
    "lessons": [
      "Data semantics matter before imputation: absence is not always missing information.",
      "Serving inputs constrain the model and the experiments that can be compared fairly.",
      "A saved notebook result does not prove a fresh clone can run the deployed workflow."
    ],
    "nextSteps": [
      "Publish the missing src/models modules and a model artifact or complete retraining path.",
      "Run a fresh-clone inference and preprocessing-parity check.",
      "Use a new evaluation set for later model selection and report temporal/domain limitations."
    ],
    "delivery": "Data loading and preprocessing implementations were inspected, alongside API/registry dependencies. The canonical checkout is incomplete for execution: src/models is absent and models contains only .gitkeep. Notebook results remain useful recorded evidence; a runnable service or deployment was not verified.",
    "sources": [
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "README.md",
        "section": "Production Model; API contract; Model Results; architecture",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/README.md",
        "readStatus": "read (scope stated in section)",
        "sha256": "4a67c8c1d9a36edfde215a069a8c1c802159513b5d7fb5ab7134fe3c438ee067",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "notebooks/01_experiment.ipynb",
        "section": "markdown outline; source/saved outputs/execution in cells 13,16,37,41,243,262,268,271,274,277,283,292,301; sections 2,4,11,13–15",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/notebooks/01_experiment.ipynb",
        "readStatus": "read (scope stated in section)",
        "sha256": "5ac1954081bc897c9f348f018569aa7567d9222b132467f775421e6e6f1c6a60",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "src/data/data_loader.py",
        "section": "read_csv_honest; validate_raw; contract_signature; purify_holdout; load_train_holdout",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/src/data/data_loader.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "4a8a894d98f9382c0a3e78156b009373d75249afdaf9dc76cae1bf0444b1ba6e",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "src/data/data_preprocessor.py",
        "section": "prepare_features; token_kontrak_ke_nan; build_preprocessor; target transforms",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/src/data/data_preprocessor.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "5b7e4b5cbdc2269b9c21c9c75ccd04fd7d73d1c07d4a99e17ee0bc75805985d4",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "api/service.py",
        "section": "imports and function outline; src.models.predict dependency; not complete behavior review",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/api/service.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "a787418200df557fd412134b9fdfb9da7788c30833817c1855d813390cc62432",
        "workingTreeStatus": "clean"
      },
      {
        "repo": "https://github.com/Gidion123/MLOps-house-price-prediction",
        "path": "scripts/registry.py",
        "section": "imports and registry/trainer dependency; not complete execution review",
        "ref": "81da17b3470ae4a4aee556f173da6002bf7d47fc",
        "url": "https://github.com/Gidion123/MLOps-house-price-prediction/blob/81da17b3470ae4a4aee556f173da6002bf7d47fc/scripts/registry.py",
        "readStatus": "read (scope stated in section)",
        "sha256": "91282980d13fdb2506865e704450bfafdcb4fbf1d968f97eb82f738073c6dd49",
        "workingTreeStatus": "clean"
      }
    ],
    "checkedAt": "2026-10-15",
    "contribution": "I explored the housing data, compared models, defined the prediction inputs, and built preprocessing and serving scaffolding. The public checkout still needs missing modules and model artifacts for a complete rerun."
  },
  "smartshopper": {
    "summary": "A shopping assistant that separates personal recommendations from store-policy questions, including requests that need both.",
    "subtitle": "Engineering system · synthetic catalog and policy corpus",
    "exploration": [
      {
        "question": "Does every shopping question need the same data?",
        "finding": "Recommendations use a user profile and interaction history; policy answers use shared documents.",
        "decision": "Expose separate product and policy tools. For mixed requests, send only the policy question to retrieval.",
        "limitation": "The routing instruction is a design constraint, not a guarantee of correct answers.",
        "sourcePaths": [
          "docs/01_analisis_kebutuhan.md",
          "smartshopper_agent/agent.py"
        ],
        "population": ""
      },
      {
        "question": "What should valid synthetic data guarantee?",
        "finding": "Inspected files contain 100 products, 30 users, 240 interactions, and 80 policy documents in 12 categories. The validator checks references, budgets and candidate availability.",
        "decision": "Validate assumptions before embedding and storage; distinguish cancellation, return and refund.",
        "limitation": "Synthetic coherence does not establish real-world recommendation quality.",
        "sourcePaths": [
          "data/products.csv",
          "data/users.csv",
          "data/interactions.csv",
          "data/common_information.json",
          "scripts/validate_data.py"
        ],
        "population": "Current synthetic data files; counts read directly"
      },
      {
        "question": "How can ranking respect practical constraints?",
        "finding": "Local cosine similarity compares product embeddings with an interaction-weighted user vector. Seen products are removed and the budget is applied.",
        "decision": "Use content-based ranking with click/wishlist/purchase weights 1/2/3 and a category bonus of 0.05.",
        "limitation": "These are design parameters, not learned optima. No controlled collaborative-filtering comparison was demonstrated.",
        "sourcePaths": [
          "recommender.py"
        ],
        "population": ""
      },
      {
        "question": "How should short policies be retrieved?",
        "finding": "Policies are short topics. Atlas search scores are converted to cosine scale before thresholding.",
        "decision": "Retain whole topics and encode title, category, content and keywords. Filter retrieved context before generation.",
        "limitation": "Thresholds are corpus-specific, not confidence. Editing JSON requires updating stored embeddings.",
        "sourcePaths": [
          "docs/02_storing_strategy.md",
          "smartshopper_agent/knowledge_base.py",
          "smartshopper_agent/common_info_tool.py"
        ],
        "population": ""
      },
      {
        "question": "Does the model select the intended tools?",
        "finding": "A saved report matches expected tool sets for direct product, policy, mixed and out-of-scope scenarios.",
        "decision": "Keep observable calls and fresh sessions for development tests.",
        "limitation": "Tool selection does not assess factual answers or recommendation utility.",
        "sourcePaths": [
          "testing/test_routing.py",
          "testing/test_reports/test_routing20260916_171204.txt"
        ],
        "population": ""
      }
    ],
    "experiments": [
      "The saved routing check covers eight predefined scenarios. Its comparator checks called tool names, not generated-answer quality.",
      "Content-based recommendation suits this small synthetic catalog; comparative recommendation quality has not been established."
    ],
    "results": [
      {
        "metric": "Routing scenarios with expected tool set",
        "value": 8,
        "unit": "of 8 scenarios",
        "split": "Development scenarios; saved 2026-09-16",
        "sampleSize": 8,
        "modelVersion": "Configured ADK agent",
        "evidenceStatus": "recorded",
        "sourcePath": "testing/test_reports/test_routing20260916_171204.txt",
        "context": "Recorded run, not rerun. Does not measure answer or recommendation accuracy.",
        "decimals": 4,
        "displayLabel": "Configured ADK agent"
      },
      {
        "metric": "Synthetic catalog size",
        "value": 100,
        "unit": "products",
        "split": "Current source data",
        "sampleSize": 100,
        "modelVersion": "Synthetic dataset",
        "evidenceStatus": "implementation-verified",
        "sourcePath": "data/products.csv",
        "context": "Also 30 users, 240 interactions, 80 policies across 12 categories. Counts inspected directly.",
        "decimals": 4,
        "displayLabel": "Synthetic dataset"
      }
    ],
    "workflow": [
      {
        "label": "Product recommendation",
        "flow": [
          "User and interaction CSVs",
          "Weighted product embeddings",
          "Local cosine similarity",
          "Exclude seen products + budget filter",
          "Category bonus + top-N"
        ]
      },
      {
        "label": "Policy retrieval",
        "flow": [
          "Policy-only question",
          "Query embedding",
          "MongoDB Atlas Vector Search",
          "Cosine-scale threshold",
          "Context + Gemini answer + sources"
        ]
      }
    ],
    "delivery": "Streamlit exposes conversations and tool calls. Gemini and MongoDB services require configuration; live service availability was not tested.",
    "lessons": [
      "Define intent and source boundaries before tools.",
      "Similarity scores are ranking signals, not confidence.",
      "Routing success does not establish recommendation usefulness."
    ],
    "nextSteps": [
      "Create a held-out query set with answer-level judgments and difficult mixed intents.",
      "Evaluate recommendation relevance and cold starts against a baseline.",
      "Version policies and check deletion as well as upsert."
    ],
    "sources": [
      {
        "path": "README.md",
        "section": "Dataset; pipeline; limitations",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/README.md",
        "scope": ""
      },
      {
        "path": "docs/01_analisis_kebutuhan.md",
        "section": "Sections 1–6",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/docs/01_analisis_kebutuhan.md",
        "scope": ""
      },
      {
        "path": "docs/02_storing_strategy.md",
        "section": "Storage decisions and score scale",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/docs/02_storing_strategy.md",
        "scope": ""
      },
      {
        "path": "recommender.py",
        "section": "create_user_embedding; recommend_products; constants",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/recommender.py",
        "scope": ""
      },
      {
        "path": "scripts/validate_data.py",
        "section": "Validation functions; code inspected, script not run",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/scripts/validate_data.py",
        "scope": ""
      },
      {
        "path": "smartshopper_agent/agent.py",
        "section": "AGENT_INSTRUCTION and tools",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/smartshopper_agent/agent.py",
        "scope": ""
      },
      {
        "path": "smartshopper_agent/product_tool.py",
        "section": "get_product_recommendations",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/smartshopper_agent/product_tool.py",
        "scope": ""
      },
      {
        "path": "smartshopper_agent/common_info_tool.py",
        "section": "RAG prompt; context and retrieval",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/smartshopper_agent/common_info_tool.py",
        "scope": ""
      },
      {
        "path": "smartshopper_agent/knowledge_base.py",
        "section": "vector_search; retrieve_documents",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/smartshopper_agent/knowledge_base.py",
        "scope": ""
      },
      {
        "path": "testing/test_routing.py",
        "section": "SCENARIOS and tool-set comparator",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/testing/test_routing.py",
        "scope": ""
      },
      {
        "path": "testing/test_reports/test_routing20260916_171204.txt",
        "section": "Scenario/status lines",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/testing/test_reports/test_routing20260916_171204.txt",
        "scope": ""
      },
      {
        "path": "testing/test_reports/test_retrieval20260916_170940.txt",
        "section": "Selected retrieval result lines",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/testing/test_reports/test_retrieval20260916_170940.txt",
        "scope": ""
      },
      {
        "path": "prompts/generate_dataset.md",
        "section": "Synthetic dataset description",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/prompts/generate_dataset.md",
        "scope": ""
      },
      {
        "path": "data/products.csv",
        "section": "Row count and schema inspected directly",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/data/products.csv",
        "scope": ""
      },
      {
        "path": "data/users.csv",
        "section": "Row count and schema inspected directly",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/data/users.csv",
        "scope": ""
      },
      {
        "path": "data/interactions.csv",
        "section": "Row count and schema inspected directly",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/data/interactions.csv",
        "scope": ""
      },
      {
        "path": "data/common_information.json",
        "section": "Row count and schema inspected directly",
        "ref": "ab920bc6e75c9ec5192fab1c884334bf428c2ed9",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/personalized-smartshopper-assistant/blob/main/data/common_information.json",
        "scope": ""
      }
    ],
    "repo": "https://github.com/Gidion123/personalized-smartshopper-assistant",
    "checkedAt": "2026-10-15",
    "evidenceNote": "Saved outputs and implementation inspected; model training and paid API experiments not rerun.",
    "contribution": "I translated shopping and store-information requirements into separate recommendation and retrieval tools, synthetic data validation, and routing checks.",
    "headlineIndices": [
      1,
      0
    ]
  },
  "smartsplit": {
    "summary": "A receipt-to-bill workflow built around a practical constraint: extracted totals need review before money is assigned.",
    "subtitle": "Recorded reader experiment · validation and bill-splitting implementation",
    "exploration": [
      {
        "question": "Is readable output enough for splitting a bill?",
        "finding": "Evaluation separates item matching, final totals, arithmetic consistency and parse success.",
        "decision": "Measure structured fields and calculations separately.",
        "limitation": "Greedy name matching does not establish correctness of every item field.",
        "sourcePaths": [
          "research/metrics.py",
          "research/results/summary.csv"
        ],
        "population": "20 receipt images with manual ground truth"
      },
      {
        "question": "Which reader balanced the measured needs?",
        "finding": "DeepSeek records item F1 0.839 and 17/20 final-total matches; only 12/20 pass arithmetic consistency after normalization.",
        "decision": "Keep the cloud reader as a main extraction option, with validation and human review.",
        "limitation": "Matching the total does not mean the entire receipt is correct.",
        "sourcePaths": [
          "research/results/summary.csv",
          "research/results/accuracy.csv",
          "modules/validation.py",
          "modules/ui/step_review.py"
        ],
        "population": "Same 20 receipts; first successful result per receipt"
      },
      {
        "question": "Why distinguish run success from receipt coverage?",
        "finding": "Qwen has 57 successful runs out of 60, while every receipt succeeds at least once.",
        "decision": "Report both run counts and coverage.",
        "limitation": "First-successful-result accuracy hides retries if reliability is omitted.",
        "sourcePaths": [
          "research/benchmark.py",
          "research/results/runs.csv",
          "research/results/summary.csv"
        ],
        "population": ""
      },
      {
        "question": "What did decoding experiments reveal?",
        "finding": "Notebook notes describe greedy repetition at the token cap. Current Qwen code uses sampling; saved runs still include parse failures.",
        "decision": "Treat structured-output validity as a selection criterion and retain diagnostics.",
        "limitation": "The greedy-to-sampling narrative was not reproduced as a controlled experiment here.",
        "sourcePaths": [
          "notebooks/01_Research.ipynb",
          "modules/readers/qwen_reader.py"
        ],
        "population": ""
      },
      {
        "question": "How should errors affect the workflow?",
        "finding": "The review UI disables progression when arithmetic errors remain. Splitting allocates charges and uses largest-remainder rounding.",
        "decision": "Correct extraction before assignment and reconcile shares to the bill total.",
        "limitation": "Arithmetic consistency cannot establish fidelity to the original image.",
        "sourcePaths": [
          "modules/ui/step_review.py",
          "modules/validation.py",
          "modules/split.py"
        ],
        "population": ""
      }
    ],
    "experiments": [
      "DeepSeek cloud, Donut CORD-v2 and Qwen3-VL-2B-Instruct were compared on the same 20 images. Cloud ran once per receipt; local models three times.",
      "Field metrics use each receipt’s first successful result. Monetary equality uses an absolute tolerance of 1 rupiah. Arithmetic checks run after normalization.",
      "Recorded means: 1.670 s cloud, 2.149 s Donut/MPS, 10.698 s Qwen/MPS. This is not a hardware-controlled timing comparison."
    ],
    "results": [
      {
        "metric": "Mean item F1",
        "value": 0.8386021872863978,
        "unit": "F1",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "DeepSeek cloud reader",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "Macro mean over 20 receipts; greedy name-based matching.",
        "decimals": 3,
        "displayLabel": "DeepSeek cloud reader",
        "sampleUnit": "receipts"
      },
      {
        "metric": "Final-total match",
        "value": 0.85,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "DeepSeek cloud reader",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "17/20; monetary tolerance ≤1 rupiah.",
        "decimals": 3,
        "displayLabel": "DeepSeek cloud reader",
        "sampleUnit": "receipts",
        "displayValue": "17/20 (85%)"
      },
      {
        "metric": "Arithmetic consistency",
        "value": 0.6,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "DeepSeek cloud reader",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "12/20 after normalization.",
        "decimals": 3,
        "displayLabel": "DeepSeek cloud reader",
        "sampleUnit": "receipts",
        "displayValue": "12/20 (60%)"
      },
      {
        "metric": "Successful inference runs",
        "value": 20,
        "unit": "of 20 runs",
        "split": "Recorded benchmark; all attempted inference runs",
        "sampleSize": 20,
        "modelVersion": "DeepSeek cloud reader",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud once per receipt; local models three times.",
        "decimals": 3,
        "displayLabel": "DeepSeek cloud reader",
        "sampleUnit": "runs"
      },
      {
        "metric": "Mean inference time",
        "value": 1.67,
        "unit": "seconds",
        "split": "Recorded benchmark; non-null successful inference timings",
        "sampleSize": 20,
        "modelVersion": "DeepSeek cloud reader",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud versus local MPS; hardware not controlled.",
        "decimals": 3,
        "displayLabel": "DeepSeek cloud reader",
        "sampleUnit": "runs"
      },
      {
        "metric": "Mean item F1",
        "value": 0.45858789358789354,
        "unit": "F1",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Donut CORD-v2",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "Macro mean over 20 receipts; greedy name-based matching.",
        "decimals": 3,
        "displayLabel": "Donut CORD-v2",
        "sampleUnit": "receipts"
      },
      {
        "metric": "Final-total match",
        "value": 0.35,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Donut CORD-v2",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "7/20; monetary tolerance ≤1 rupiah.",
        "decimals": 3,
        "displayLabel": "Donut CORD-v2",
        "sampleUnit": "receipts",
        "displayValue": "7/20 (35%)"
      },
      {
        "metric": "Arithmetic consistency",
        "value": 0,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Donut CORD-v2",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "0/20 after normalization.",
        "decimals": 3,
        "displayLabel": "Donut CORD-v2",
        "sampleUnit": "receipts",
        "displayValue": "0/20 (0%)"
      },
      {
        "metric": "Successful inference runs",
        "value": 60,
        "unit": "of 60 runs",
        "split": "Recorded benchmark; all attempted inference runs",
        "sampleSize": 60,
        "modelVersion": "Donut CORD-v2",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud once per receipt; local models three times.",
        "decimals": 3,
        "displayLabel": "Donut CORD-v2",
        "sampleUnit": "runs"
      },
      {
        "metric": "Mean inference time",
        "value": 2.149,
        "unit": "seconds",
        "split": "Recorded benchmark; non-null successful inference timings",
        "sampleSize": 60,
        "modelVersion": "Donut CORD-v2",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud versus local MPS; hardware not controlled.",
        "decimals": 3,
        "displayLabel": "Donut CORD-v2",
        "sampleUnit": "runs"
      },
      {
        "metric": "Mean item F1",
        "value": 0.8207017543859649,
        "unit": "F1",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Qwen3-VL-2B-Instruct",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "Macro mean over 20 receipts; greedy name-based matching.",
        "decimals": 3,
        "displayLabel": "Qwen3-VL-2B-Instruct",
        "sampleUnit": "receipts"
      },
      {
        "metric": "Final-total match",
        "value": 0.3,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Qwen3-VL-2B-Instruct",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "6/20; monetary tolerance ≤1 rupiah.",
        "decimals": 3,
        "displayLabel": "Qwen3-VL-2B-Instruct",
        "sampleUnit": "receipts",
        "displayValue": "6/20 (30%)"
      },
      {
        "metric": "Arithmetic consistency",
        "value": 0.6,
        "unit": "fraction",
        "split": "Recorded benchmark; first successful result for field metrics",
        "sampleSize": 20,
        "modelVersion": "Qwen3-VL-2B-Instruct",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/accuracy.csv",
        "context": "12/20 after normalization.",
        "decimals": 3,
        "displayLabel": "Qwen3-VL-2B-Instruct",
        "sampleUnit": "receipts",
        "displayValue": "12/20 (60%)"
      },
      {
        "metric": "Successful inference runs",
        "value": 57,
        "unit": "of 60 runs",
        "split": "Recorded benchmark; all attempted inference runs",
        "sampleSize": 60,
        "modelVersion": "Qwen3-VL-2B-Instruct",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud once per receipt; local models three times.",
        "decimals": 3,
        "displayLabel": "Qwen3-VL-2B-Instruct",
        "sampleUnit": "runs"
      },
      {
        "metric": "Mean inference time",
        "value": 10.698,
        "unit": "seconds",
        "split": "Recorded benchmark; non-null successful inference timings",
        "sampleSize": 57,
        "modelVersion": "Qwen3-VL-2B-Instruct",
        "evidenceStatus": "recorded",
        "sourcePath": "research/results/summary.csv",
        "context": "Cloud versus local MPS; hardware not controlled.",
        "decimals": 3,
        "displayLabel": "Qwen3-VL-2B-Instruct",
        "sampleUnit": "runs"
      }
    ],
    "workflow": [
      {
        "label": "Application workflow",
        "flow": [
          "Receipt image",
          "Reader",
          "Schema normalization",
          "Arithmetic checks + human review",
          "Item assignment",
          "Proportional charges + rounding",
          "Bill shares"
        ]
      }
    ],
    "delivery": "The review UI blocks progression on validation errors. Portfolio illustrations use existing redacted screenshots; raw receipts are excluded.",
    "lessons": [
      "Parsing successfully and reading correctly are separate outcomes.",
      "Cloud and local timings require execution context.",
      "A matching total still needs human review."
    ],
    "nextSteps": [
      "Broaden the evaluation with a documented receipt sampling protocol.",
      "Compare decoding configurations on identical run schedules.",
      "Measure error severity and correction effort."
    ],
    "sources": [
      {
        "path": "notebooks/01_Research.ipynb",
        "section": "Cells 0f79b9c4 (execution 3), 69d48a9f, 17b354e3 (execution 13), fea16984 (execution 14), fdbbfd56; selected markdown/source/outputs, no Run All",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/notebooks/01_Research.ipynb",
        "scope": ""
      },
      {
        "path": "research/results/summary.csv",
        "section": "All three model rows",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/results/summary.csv",
        "scope": ""
      },
      {
        "path": "research/results/accuracy.csv",
        "section": "60 model/receipt rows; aggregate fields",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/results/accuracy.csv",
        "scope": ""
      },
      {
        "path": "research/results/runs.csv",
        "section": "140 runs; group counts",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/results/runs.csv",
        "scope": ""
      },
      {
        "path": "research/results/environment.json",
        "section": "Machine and model IDs",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/results/environment.json",
        "scope": ""
      },
      {
        "path": "research/metrics.py",
        "section": "match_items; _same; evaluate_receipt",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/metrics.py",
        "scope": ""
      },
      {
        "path": "research/benchmark.py",
        "section": "first_result and summarize",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/research/benchmark.py",
        "scope": ""
      },
      {
        "path": "modules/validation.py",
        "section": "TOLERANCE; normalization; arithmetic checks",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/modules/validation.py",
        "scope": ""
      },
      {
        "path": "modules/split.py",
        "section": "split_bill; allocate_rounding",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/modules/split.py",
        "scope": ""
      },
      {
        "path": "modules/readers/deepseek_reader.py",
        "section": "DEFAULT_DEEPSEEK_MODEL",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/modules/readers/deepseek_reader.py",
        "scope": ""
      },
      {
        "path": "modules/readers/qwen_reader.py",
        "section": "Sampling and token cap",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/modules/readers/qwen_reader.py",
        "scope": ""
      },
      {
        "path": "modules/ui/step_review.py",
        "section": "Validation and next_disabled",
        "ref": "6f97b1f6c754edae261770c50b26b79d8080e600",
        "readStatus": "read",
        "url": "https://github.com/Gidion123/smartsplit-bill-ai/blob/main/modules/ui/step_review.py",
        "scope": ""
      }
    ],
    "repo": "https://github.com/Gidion123/smartsplit-bill-ai",
    "checkedAt": "2026-10-15",
    "evidenceNote": "Saved outputs and implementation inspected; model training and paid API experiments not rerun.",
    "contribution": "I compared receipt readers and implemented normalization, arithmetic validation, review, and splitting. This is an application and research exercise; receipt reading still needs human checks.",
    "headlineIndices": [
      0,
      1,
      2
    ],
    "resultNote": "Field metrics use the first successful result per receipt. Monetary tolerance is ≤1 rupiah. Cloud ran once per receipt; local readers ran three times. Timing is not a controlled hardware comparison."
  },
  "retail": {
    "summary": "Turning historical retail transactions into priorities for product availability and customer retention, while keeping sales, returns and customer-level revenue separate.",
    "subtitle": "Additional data analysis · historical descriptive study",
    "exploration": [
      {
        "question": "Are all negative transactions returns?",
        "finding": "Administrative codes overlap cancellation prefixes.",
        "decision": "Classify administrative codes first, then returns and sales.",
        "limitation": "Rule order changes classification, not business performance.",
        "sourcePaths": [
          "project_eda.ipynb"
        ],
        "population": ""
      },
      {
        "question": "Should missing customer IDs remove revenue?",
        "finding": "Unidentified transactions still contribute to revenue.",
        "decision": "Retain revenue rows; restrict customer segmentation to identified accounts.",
        "limitation": "RFM covers only identified customers.",
        "sourcePaths": [
          "project_eda.ipynb"
        ],
        "population": ""
      },
      {
        "question": "Did returns improve?",
        "finding": "Rates 4.68%, 4.52%, and 2.18% use different definitions or exclusions.",
        "decision": "Explain the subsets instead of presenting a before/after gain.",
        "limitation": "The narrowest rate excludes two bulk cancellations.",
        "sourcePaths": [
          "project_eda.ipynb"
        ],
        "population": ""
      },
      {
        "question": "Which products deserve the first inventory review?",
        "finding": "The top 760 products (20% of 3,800) account for 77.91% of net product revenue.",
        "population": "Product-name groups excluding shipping and discount transactions; revenue denominator £9,772,003.97.",
        "interpretation": "Revenue concentration makes availability of the core product group a useful operational priority.",
        "decision": "Propose SKU-level stock and margin reviews for the core group before allocating broad promotional spend.",
        "limitation": "Historical revenue is not profit or measured project impact. Product-name grouping can combine variants; map groups back to SKUs before acting. No recommendation was deployed or uplift measured.",
        "sourcePaths": [
          "project_eda.ipynb"
        ],
        "sourceSection": "Product concentration: zero-based cell 176, ID 6faebc39; denominator cell c8e468a1."
      },
      {
        "question": "Which customer segments should a retention pilot prioritize?",
        "finding": "Champions (1,074 accounts) and Loyal Customers (626) total 1,700 accounts. Their displayed customer shares sum to approximately 38.97%, and their displayed net-revenue shares to approximately 85.04%.",
        "population": "4,362 identified customer accounts; revenue shares use only the identified-customer net-revenue subset, excluding anonymous transactions.",
        "interpretation": "A large share of recorded customer revenue is concentrated in these two segments.",
        "decision": "Propose a targeted service and retention pilot for Champions and Loyal Customers, with a comparison group to measure incremental retention.",
        "limitation": "Shares sum rounded displayed values. RFM segments describe historical behavior, not causal impact or future lifetime value; no retention uplift was measured.",
        "sourcePaths": [
          "project_eda.ipynb"
        ],
        "sourceSection": "Section 5.2.3 Customer Segmentation Mapping; zero-based cell 213, ID b2f74c1e."
      }
    ],
    "experiments": [
      "Partition rules and integrity checks were inspected in saved notebook outputs; analysis was not rerun."
    ],
    "results": [
      {
        "metric": "Cleaned transaction lines",
        "value": 536641,
        "unit": "lines",
        "split": "Historical data after cleaning",
        "sampleSize": 536641,
        "modelVersion": "Recorded notebook",
        "evidenceStatus": "recorded",
        "sourcePath": "project_eda.ipynb",
        "context": "524,544 sales; 8,874 returns; 3,223 administrative.",
        "decimals": 4,
        "displayLabel": "Recorded notebook"
      },
      {
        "metric": "Net revenue",
        "value": 10045769.87,
        "unit": "GBP",
        "split": "Sales plus return adjustments",
        "sampleSize": 533418,
        "modelVersion": "Recorded notebook",
        "evidenceStatus": "recorded",
        "sourcePath": "project_eda.ipynb",
        "context": "£10,539,306.78 gross sales + −£493,536.91 returns; excludes administrative partition.",
        "decimals": 2,
        "displayLabel": "Recorded notebook"
      },
      {
        "metric": "Top 20% products: net-revenue share",
        "value": 77.91,
        "unit": "%",
        "split": "Products excluding shipping and discount transactions",
        "sampleSize": 3800,
        "sampleUnit": "product-name groups",
        "modelVersion": "Product-name concentration analysis",
        "displayLabel": "Product concentration",
        "evidenceStatus": "recorded",
        "sourcePath": "project_eda.ipynb",
        "sourceSection": "Cell 176 / 6faebc39; c8e468a1 denominator",
        "context": "760 of 3,800 products; £9,772,003.97 subset net revenue.",
        "decimals": 2
      },
      {
        "metric": "Champions + Loyal: identified-customer revenue share",
        "value": 85.04,
        "unit": "%",
        "split": "Identified-customer net-revenue subset",
        "sampleSize": 4362,
        "sampleUnit": "identified accounts",
        "modelVersion": "RFM segmentation",
        "displayLabel": "RFM segmentation",
        "evidenceStatus": "recorded",
        "sourcePath": "project_eda.ipynb",
        "sourceSection": "Cell 213 / b2f74c1e; section 5.2.3",
        "context": "Approximate sum of displayed shares, 69.52% + 15.52%; 1,074 + 626 = 1,700 accounts. Not total-company revenue.",
        "decimals": 2
      }
    ],
    "workflow": [
      {
        "label": "Analysis workflow",
        "flow": [
          "Structural audit",
          "Cleaning",
          "Prioritized transaction rules",
          "Integrity checks",
          "Revenue and customer analysis"
        ]
      }
    ],
    "lessons": [
      "Historical revenue is not revenue generated by this project.",
      "One year of patterns does not establish causal effects."
    ],
    "nextSteps": [
      "Version metric definitions and compare sensitivity across return subsets."
    ],
    "sources": [
      {
        "path": "README.md",
        "section": "Dataset; cleaning decisions; gross-label conflict",
        "ref": "9101505b3beba4ce7222e32500648c87a989006c",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/online-retail-eda/blob/9101505b3beba4ce7222e32500648c87a989006c/README.md",
        "scope": "",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "project_eda.ipynb",
        "section": "Revenue: cell 148 / 4d08eba2; product concentration: cell 176 / 6faebc39, denominator c8e468a1; RFM: section 5.2.3, cell 213 / b2f74c1e. Zero-based indices; saved outputs and code read, not executed.",
        "ref": "9101505b3beba4ce7222e32500648c87a989006c",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/online-retail-eda/blob/9101505b3beba4ce7222e32500648c87a989006c/project_eda.ipynb",
        "scope": "Selected markdown, code, saved output and execution state; no notebook run",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/online-retail-eda",
    "checkedAt": "2026-10-17",
    "evidenceNote": "Saved outputs and implementation inspected; model training and paid API experiments not rerun.",
    "contribution": "I examined transaction semantics, wrote cleaning and partition rules, and used the resulting subsets for descriptive revenue and customer analysis.",
    "headlineIndices": []
  },
  "playstore": {
    "summary": "A cleaning exercise focused on units, duplicate definitions, and preserving useful missingness information.",
    "subtitle": "Additional data analysis · cleaning decisions",
    "exploration": [
      {
        "question": "Does missing size mean unknown size?",
        "finding": "Device-dependent size has a separate flag; lowercase k requires conversion.",
        "decision": "Preserve Size_Varies and normalize units.",
        "limitation": "A numeric null can have a known meaning.",
        "sourcePaths": [
          "data_cleaning_google_playstore.ipynb"
        ],
        "population": ""
      },
      {
        "question": "Are exact duplicates the entire reduction?",
        "finding": "483 exact duplicates precede a final 9,660 rows from 10,841.",
        "decision": "Handle repeated app names separately using review count.",
        "limitation": "The total reduction is 1,181 rows, not 483.",
        "sourcePaths": [
          "data_cleaning_google_playstore.ipynb"
        ],
        "population": ""
      },
      {
        "question": "How certain is the corrupted-row repair?",
        "finding": "Category and genre were inferred from a similar app.",
        "decision": "Document a manual assumption.",
        "limitation": "This is not verified ground truth.",
        "sourcePaths": [
          "data_cleaning_google_playstore.ipynb"
        ],
        "population": ""
      }
    ],
    "experiments": [
      "The notebook examines units, shifted fields, repeated records and extreme values. No causal app-survival claim is made."
    ],
    "results": [
      {
        "metric": "Cleaned rows",
        "value": 9660,
        "unit": "rows",
        "split": "Saved cleaned dataset",
        "sampleSize": 9660,
        "modelVersion": "Recorded notebook",
        "evidenceStatus": "recorded",
        "sourcePath": "data_cleaning_google_playstore.ipynb",
        "context": "10,841 raw rows; 483 exact duplicates are part of the 1,181-row reduction.",
        "decimals": 4,
        "displayLabel": "Recorded notebook"
      }
    ],
    "workflow": [
      {
        "label": "Cleaning workflow",
        "flow": [
          "Schema checks",
          "Shifted-field repair",
          "Units + flags",
          "Deduplication",
          "Missingness and outlier review"
        ]
      }
    ],
    "lessons": [
      "Consistent cleaning does not guarantee every record is correct."
    ],
    "nextSteps": [
      "Track manual-repair provenance and test edge-case unit strings."
    ],
    "sources": [
      {
        "path": "README.md",
        "section": "Pipeline and decisions",
        "ref": "15112acc59fdb39d2f783694e2be445c2c44afa1",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/google-playstore-data-cleaning/blob/15112acc59fdb39d2f783694e2be445c2c44afa1/README.md",
        "scope": "",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "data_cleaning_google_playstore.ipynb",
        "section": "Repair lines 1334–1337; cells b195898f/43eceea6 executions 26/27; 5e58987f execution 38; 8b190e52 execution 41; final info lines 4110–4132",
        "ref": "15112acc59fdb39d2f783694e2be445c2c44afa1",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/google-playstore-data-cleaning/blob/15112acc59fdb39d2f783694e2be445c2c44afa1/data_cleaning_google_playstore.ipynb",
        "scope": "Selected code, markdown, saved outputs; cleaned CSV not independently parsed",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/google-playstore-data-cleaning",
    "checkedAt": "2026-10-17",
    "evidenceNote": "Saved outputs and implementation inspected; model training and paid API experiments not rerun.",
    "contribution": "I inspected schema problems and units, handled repeated app records, and documented assumptions made during cleaning.",
    "headlineIndices": []
  },
  "boston": {
    "summary": "An educational regression study of functional form, correlated features, and modest regularization.",
    "subtitle": "Additional data analysis · historical educational regression",
    "exploration": [
      {
        "question": "Did regularization improve prediction?",
        "finding": "Linear and Ridge validation RMSE both round to 4.5311; Lasso is 4.5312.",
        "decision": "Choose light Ridge regularization without claiming a meaningful predictive win.",
        "limitation": "Validation covers 76 rows.",
        "sourcePaths": [
          "notebook/housing_price_regression.ipynb",
          "DECISIONS.md"
        ],
        "population": ""
      },
      {
        "question": "Should correlated features be removed automatically?",
        "finding": "Dropping rad reduces collinearity but worsens recorded validation error.",
        "decision": "Retain features and interpret coefficients in context.",
        "limitation": "Associations are not causal effects.",
        "sourcePaths": [
          "DECISIONS.md"
        ],
        "population": ""
      },
      {
        "question": "What can aggregate error conceal?",
        "finding": "The saved review includes one negative prediction.",
        "decision": "Inspect failures alongside MAE and RMSE.",
        "limitation": "Historical data and a documented racial feature make this unsuitable for a valuation service.",
        "sourcePaths": [
          "notebook/housing_price_regression.ipynb",
          "README.md"
        ],
        "population": ""
      }
    ],
    "experiments": [
      "The split is 354 training / 76 validation / 76 test rows. Log transforms address functional form; Ridge α=0.001 retains 13 features."
    ],
    "results": [
      {
        "metric": "Test MAE",
        "value": 2.5271,
        "unit": "medv units",
        "split": "Test",
        "sampleSize": 76,
        "modelVersion": "Ridge α=0.001",
        "evidenceStatus": "recorded",
        "sourcePath": "notebook/housing_price_regression.ipynb",
        "context": "medv uses thousands of historical USD; not contemporary house-price error.",
        "decimals": 4,
        "displayLabel": "Ridge α=0.001"
      },
      {
        "metric": "Test RMSE",
        "value": 3.3947,
        "unit": "medv units",
        "split": "Test",
        "sampleSize": 76,
        "modelVersion": "Ridge α=0.001",
        "evidenceStatus": "recorded",
        "sourcePath": "notebook/housing_price_regression.ipynb",
        "context": "Recorded, not reproduced.",
        "decimals": 4,
        "displayLabel": "Ridge α=0.001"
      },
      {
        "metric": "Test MAPE",
        "value": 13.5348,
        "unit": "%",
        "split": "Test",
        "sampleSize": 76,
        "modelVersion": "Ridge α=0.001",
        "evidenceStatus": "recorded",
        "sourcePath": "notebook/housing_price_regression.ipynb",
        "context": "Error, not accuracy.",
        "decimals": 2,
        "displayLabel": "Ridge α=0.001"
      }
    ],
    "workflow": [
      {
        "label": "Study workflow",
        "flow": [
          "Data checks",
          "Train / validation / test split",
          "Transforms",
          "Linear / Ridge / Lasso",
          "Error review"
        ]
      }
    ],
    "lessons": [
      "Small metric differences do not establish superiority.",
      "The source dataset is not included in the repository."
    ],
    "nextSteps": [
      "Use a suitable contemporary dataset for future housing applications."
    ],
    "sources": [
      {
        "path": "README.md",
        "section": "Dataset limitations; results",
        "ref": "7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/boston-housing-price-prediction/blob/7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c/README.md",
        "scope": "",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "DECISIONS.md",
        "section": "Sections 2, 4, 5, 6, 8",
        "ref": "7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/boston-housing-price-prediction/blob/7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c/DECISIONS.md",
        "scope": "",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "notebook/housing_price_regression.ipynb",
        "section": "Cell 5906dfea execution 18; comparisons executions 46/48/52; test output execution 69 lines 6505–6513; error-review cell 90d60167 execution 70",
        "ref": "7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/boston-housing-price-prediction/blob/7f7b4cace9a8803c1f0522d6b2f64c5f36ae159c/notebook/housing_price_regression.ipynb",
        "scope": "Selected code, markdown, saved outputs and execution state; no Run All",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/boston-housing-price-prediction",
    "checkedAt": "2026-10-17",
    "evidenceNote": "Saved outputs and implementation inspected; model training and paid API experiments not rerun.",
    "contribution": "I studied transformations, collinearity, and regularization in an educational regression notebook, including error review and dataset limitations.",
    "headlineIndices": []
  },
  "ner": {
    "summary": "Fine-tuning multilingual BERT for Indonesian entity extraction, with label quality and organization boundaries at the center of the analysis.",
    "subtitle": "Notebook study · Indonesian NLP · Recorded experiment",
    "exploration": [
      {
        "question": "What does the raw label vocabulary actually contain?",
        "finding": "The training parser produces 309,202 original tokens and 126 raw labels, including inconsistent spellings.",
        "population": "12,514 training sequences in the corrected NERGrit corpus.",
        "decision": "Map the task to PER, ORG, LOC and DAT using nine BIO labels; merge GPE into LOC.",
        "limitation": "Normalization is incomplete: B=PER maps to B-PER and I-DaT to I-DAT, but B-L0C maps to O.",
        "sourcePaths": [
          "Gidion Depari_Assigment_nlp.ipynb"
        ],
        "sources": [
          {
            "path": "Gidion Depari_Assigment_nlp.ipynb",
            "section": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
            "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Would token accuracy hide missed entities?",
        "finding": "Raw O labels make up 69.12% of training tokens before target mapping.",
        "population": "213,728 of 309,202 original training tokens.",
        "decision": "Select checkpoints with entity F1 and inspect per-entity precision and recall.",
        "limitation": "The reported 97.49% token accuracy measures something different from the 87.03% entity F1.",
        "sourcePaths": [
          "Gidion Depari_Assigment_nlp.ipynb"
        ],
        "sources": [
          {
            "path": "Gidion Depari_Assigment_nlp.ipynb",
            "section": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
            "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "How should long sequences be handled?",
        "finding": "The mean original-token length is 24.71; p95 is about 50 and p99 about 83.",
        "population": "Training sequences, before WordPiece tokenization.",
        "decision": "Use a 128-token tokenizer limit, dynamic padding and first-subword labeling; mask continuation and special tokens with -100.",
        "limitation": "Original-token lengths do not establish WordPiece truncation coverage. Lost spans still need a dedicated audit.",
        "sourcePaths": [
          "Gidion Depari_Assigment_nlp.ipynb"
        ],
        "sources": [
          {
            "path": "Gidion Depari_Assigment_nlp.ipynb",
            "section": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
            "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Where should the next error review focus?",
        "finding": "ORG has rounded entity F1 of 0.72, below DAT 0.94, PER 0.93 and LOC 0.87.",
        "population": "Retained and mapped test spans; ORG support is 856 entities.",
        "decision": "Prioritize organization annotations, missed boundaries and ambiguous uppercase datelines.",
        "limitation": "Some gold annotations may also be ambiguous. The current test set has already informed qualitative error analysis.",
        "sourcePaths": [
          "Gidion Depari_Assigment_nlp.ipynb"
        ],
        "sources": [
          {
            "path": "Gidion Depari_Assigment_nlp.ipynb",
            "section": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
            "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      }
    ],
    "experiments": [
      "The notebook fine-tunes bert-base-multilingual-cased for three epochs at learning rate 2e-5, batch size 16 and weight decay 0.01. Validation F1 selects the checkpoint.",
      "The saved validation F1 reaches 88.01%. This is a single recorded training run, without a multi-seed or alternative-backbone comparison."
    ],
    "results": [
      {
        "metric": "Test entity F1",
        "value": 87.03,
        "unit": "%",
        "split": "NERGrit test",
        "sampleSize": 2397,
        "modelVersion": "mBERT; four entity types; max_length=128",
        "evidenceStatus": "recorded",
        "sourcePath": "Gidion Depari_Assigment_nlp.ipynb",
        "context": "Saved seqeval overall F1 over retained, unmasked labels; 4,736 gold entities.",
        "source": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
        "sourceSection": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
        "decimals": 2,
        "displayLabel": "mBERT · four entity types",
        "sampleUnit": "sequences"
      },
      {
        "metric": "Entity precision",
        "value": 86.7,
        "unit": "%",
        "split": "NERGrit test",
        "sampleSize": 2397,
        "modelVersion": "same recorded mBERT run",
        "evidenceStatus": "recorded",
        "sourcePath": "Gidion Depari_Assigment_nlp.ipynb",
        "context": "Overall seqeval entity precision.",
        "source": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
        "sourceSection": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
        "decimals": 2,
        "displayLabel": "mBERT · four entity types",
        "sampleUnit": "sequences"
      },
      {
        "metric": "Entity recall",
        "value": 87.37,
        "unit": "%",
        "split": "NERGrit test",
        "sampleSize": 2397,
        "modelVersion": "same recorded mBERT run",
        "evidenceStatus": "recorded",
        "sourcePath": "Gidion Depari_Assigment_nlp.ipynb",
        "context": "Overall seqeval entity recall.",
        "source": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
        "sourceSection": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
        "decimals": 2,
        "displayLabel": "mBERT · four entity types",
        "sampleUnit": "sequences"
      },
      {
        "metric": "Validation entity F1",
        "value": 88.01,
        "unit": "%",
        "split": "NERGrit validation; epoch 3",
        "sampleSize": 2520,
        "modelVersion": "same recorded mBERT run",
        "evidenceStatus": "recorded",
        "sourcePath": "Gidion Depari_Assigment_nlp.ipynb",
        "context": "Checkpoint-selection metric, separate from test performance.",
        "source": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
        "sourceSection": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
        "decimals": 2,
        "displayLabel": "mBERT · four entity types",
        "sampleUnit": "sequences"
      }
    ],
    "workflow": [
      {
        "label": "Training and evaluation",
        "flow": "NERGrit splits → parse sequences → normalize target labels → WordPiece alignment → mBERT fine-tuning → entity evaluation → error review"
      }
    ],
    "lessons": [
      "Checkpoint reload logs report missing LayerNorm weight/bias and unexpected gamma/beta keys. Saved scores do not prove fresh-load equivalence.",
      "Fine-tuned mBERT weights are absent from the repository; upstream .h5 resources are unrelated to this model.",
      "Several cells retain saved outputs while their execution count is null. Run All and training were not repeated for this portfolio."
    ],
    "nextSteps": [
      "Pin a reproducible environment and compare predictions before saving and after a fresh load.",
      "Measure actual WordPiece truncation and review malformed labels and ORG boundaries before a validation-based comparison."
    ],
    "sources": [
      {
        "path": "Gidion Depari_Assigment_nlp.ipynb",
        "section": "Cells 3cf64791, 2b3b7192, 9bc41c11, 19be90dc, 98508cf2, 520a331e, f3d331fa, 12f6fd78",
        "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
        "readStatus": "Code and saved text outputs inspected",
        "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/Gidion%20Depari_Assigment_nlp.ipynb",
        "evidenceStatus": "recorded"
      },
      {
        "path": "README.md",
        "section": "Dataset, recorded results and reproducibility limitations",
        "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
        "readStatus": "Read locally and on public GitHub",
        "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/README.md",
        "evidenceStatus": "source-inspected"
      },
      {
        "path": "data_nergrit18/nergrit-corpus/Readme.md",
        "section": "Corpus attribution",
        "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
        "readStatus": "Read locally",
        "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/data_nergrit18/nergrit-corpus/Readme.md",
        "evidenceStatus": "source-inspected"
      },
      {
        "path": "data_nergrit18/nergrit-corpus/LICENSE",
        "section": "Corpus license",
        "ref": "48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e",
        "readStatus": "Read locally",
        "url": "https://github.com/Gidion123/indonesian-ner-mbert/blob/48ffb977a2ae61e0ea3df2da3e0485afbfc43b8e/data_nergrit18/nergrit-corpus/LICENSE",
        "evidenceStatus": "source-inspected"
      }
    ],
    "repo": "https://github.com/Gidion123/indonesian-ner-mbert",
    "checkedAt": "2026-10-15",
    "contribution": "I prepared the label mapping and token alignment, fine-tuned mBERT in the recorded notebook, and reviewed entity-level errors."
  },
  "recommender": {
    "summary": "A MovieLens study of sparse interactions, weak content features and why a simple popularity baseline can beat a hybrid recommender.",
    "subtitle": "Notebook study · Recommendation systems · Recorded comparison",
    "exploration": [
      {
        "question": "How much behavioral signal is available?",
        "finding": "100,836 ratings cover 610 users and 9,724 rated movies, while the full catalogue contains 9,742 movies. The interaction matrix is 1.70% filled and 98.30% empty.",
        "population": "MovieLens latest-small; 5,931,640 possible user–rated-movie cells.",
        "decision": "Inspect interaction density and popularity before choosing similarity-based methods.",
        "limitation": "Sparsity is the empty fraction; it is not the 1.70% density.",
        "sourcePaths": [
          "project_recom_system.ipynb"
        ],
        "sources": [
          {
            "path": "project_recom_system.ipynb",
            "section": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
            "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "What is gained and lost by filtering rare movies?",
        "finding": "A minimum of 20 ratings retains 1,297 movies and 67,898 ratings, with about 8.6% matrix density.",
        "population": "The filtered catalogue used for the recommendation experiment.",
        "decision": "Use the filter to reduce weakly supported item comparisons and make the coverage trade-off explicit.",
        "limitation": "The filter excludes much of the catalogue and was applied before leave-one-out evaluation.",
        "sourcePaths": [
          "project_recom_system.ipynb"
        ],
        "sources": [
          {
            "path": "project_recom_system.ipynb",
            "section": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
            "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Can genre and user tags distinguish similar movies?",
        "finding": "Only 1,572 of 9,742 catalogue movies have user tags; genre-only descriptions produce many similarity ties.",
        "population": "Full catalogue for tag coverage; filtered movies for similarity examples.",
        "decision": "Preserve terms such as Sci-Fi and multi-word tags while comparing TF-IDF content with mean-centered item CF.",
        "limitation": "Content similarity demonstrates representation behavior, not personalized recommendation quality.",
        "sourcePaths": [
          "project_recom_system.ipynb"
        ],
        "sources": [
          {
            "path": "project_recom_system.ipynb",
            "section": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
            "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Does adding content improve the measured ranking?",
        "finding": "Popularity-by-count records 31 hits, CF 17 and the single-seed hybrid 15, each over 609 eligible users.",
        "population": "Leave one liked movie out per eligible user; hit means that movie appears in the top five.",
        "decision": "Retain popularity as a serious baseline and avoid claiming that hybrid wins.",
        "limitation": "Candidate filtering differs between baseline and personalized paths; alpha is studied on this same evaluation subset.",
        "sourcePaths": [
          "project_recom_system.ipynb"
        ],
        "sources": [
          {
            "path": "project_recom_system.ipynb",
            "section": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
            "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
            "readStatus": "Code and saved text outputs inspected",
            "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      }
    ],
    "experiments": [
      "Compare TF-IDF content similarity, mean-centered item CF, a single-favorite-seed hybrid, and two popularity baselines.",
      "A separate full-profile hybrid sweep records 11/609 at alpha=0.5 and a maximum of 17/609 at alpha=0. Do not substitute those results for the single-seed experiment."
    ],
    "results": [
      {
        "metric": "HitRate@5 · popularity by count",
        "value": 0.05090311986863711,
        "unit": "fraction",
        "split": "Recorded leave-one-out",
        "sampleSize": 609,
        "modelVersion": "Popularity by count",
        "evidenceStatus": "recorded",
        "sourcePath": "project_recom_system.ipynb",
        "context": "31 hits / 609 eligible users. Shared displayed top five; candidate filtering differs from personalized methods.",
        "source": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
        "sourceSection": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
        "decimals": 4,
        "displayLabel": "Popularity by count",
        "displayValue": "31/609",
        "sampleUnit": "eligible users"
      },
      {
        "metric": "HitRate@5 · item CF",
        "value": 0.027914614121510674,
        "unit": "fraction",
        "split": "Recorded leave-one-out",
        "sampleSize": 609,
        "modelVersion": "Mean-centered item CF",
        "evidenceStatus": "recorded",
        "sourcePath": "project_recom_system.ipynb",
        "context": "17 hits / 609 eligible users; seen items masked.",
        "source": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
        "sourceSection": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
        "decimals": 4,
        "displayLabel": "Mean-centered item CF",
        "displayValue": "17/609",
        "sampleUnit": "eligible users"
      },
      {
        "metric": "HitRate@5 · single-seed hybrid",
        "value": 0.024630541871921183,
        "unit": "fraction",
        "split": "Recorded leave-one-out",
        "sampleSize": 609,
        "modelVersion": "Single-seed hybrid alpha=0.5",
        "evidenceStatus": "recorded",
        "sourcePath": "project_recom_system.ipynb",
        "context": "15 hits / 609; distinct from full-profile alpha sweep.",
        "source": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
        "sourceSection": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
        "decimals": 4,
        "displayLabel": "Single-seed hybrid alpha=0.5",
        "displayValue": "15/609",
        "sampleUnit": "eligible users"
      },
      {
        "metric": "HitRate@5 · popularity by mean rating",
        "value": 0.013136288998357963,
        "unit": "fraction",
        "split": "Recorded leave-one-out",
        "sampleSize": 609,
        "modelVersion": "Popularity by mean rating",
        "evidenceStatus": "recorded",
        "sourcePath": "project_recom_system.ipynb",
        "context": "8 hits / 609 eligible users.",
        "source": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
        "sourceSection": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
        "decimals": 4,
        "displayLabel": "Popularity by mean rating",
        "displayValue": "8/609",
        "sampleUnit": "eligible users"
      }
    ],
    "workflow": [
      {
        "label": "Notebook workflow",
        "flow": "MovieLens tables → integrity checks → catalogue filter → TF-IDF + centered rating similarities → rank candidates → leave-one-out comparison"
      }
    ],
    "lessons": [
      "The hybrid does not outperform popularity in this recorded comparison. No random baseline was executed, so a multiple-of-random headline is unsupported.",
      "The alpha sweep and catalogue prefilter prevent describing this as an unbiased final held-out benchmark.",
      "Many notebook cells have saved outputs with null execution counts; experiments were inspected, not rerun."
    ],
    "nextSteps": [
      "Use consistent candidate eligibility across every baseline and choose alpha on a separate validation split.",
      "Evaluate richer content such as plot summaries and report catalogue coverage alongside ranking quality."
    ],
    "sources": [
      {
        "path": "project_recom_system.ipynb",
        "section": "Sections 1–3, 5.3 cell 3cdff505, 5.3b cell e6ecc3f9",
        "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
        "readStatus": "Code and saved text outputs inspected",
        "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/project_recom_system.ipynb",
        "evidenceStatus": "recorded"
      },
      {
        "path": "ml-latest-small/ratings.csv",
        "section": "User/movie/interaction counts recomputed with Python csv",
        "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
        "readStatus": "Read and counted locally",
        "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/ml-latest-small/ratings.csv",
        "evidenceStatus": "source-inspected"
      },
      {
        "path": "ml-latest-small/movies.csv",
        "section": "Catalogue count",
        "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
        "readStatus": "Read and counted locally",
        "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/ml-latest-small/movies.csv",
        "evidenceStatus": "source-inspected"
      },
      {
        "path": "ml-latest-small/tags.csv",
        "section": "Tagged-movie coverage",
        "ref": "b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9",
        "readStatus": "Read and counted locally",
        "url": "https://github.com/Gidion123/hybrid-movie-recommender/blob/b5bedcbf3b66dc737b8a3977c5e2fe2a3c4a75c9/ml-latest-small/tags.csv",
        "evidenceStatus": "source-inspected"
      }
    ],
    "repo": "https://github.com/Gidion123/hybrid-movie-recommender",
    "checkedAt": "2026-10-15",
    "contribution": "I explored MovieLens interactions and content, implemented similarity-based recommendation paths, and compared them against popularity baselines."
  },
  "forecasting": {
    "summary": "Forecasting daily unique orders, with explicit separation of one-step validation, recursive forecasts and a difficult December test period.",
    "subtitle": "Notebook study · Time series · Recorded experiment",
    "exploration": [
      {
        "question": "What should count as demand?",
        "finding": "Cleaning leaves 185,652 transaction lines representing 178,406 unique orders.",
        "population": "2019 transaction dataset.",
        "decision": "Aggregate daily distinct Order ID values to model order counts.",
        "limitation": "Transaction lines are not unique orders, and the forecast target is not revenue.",
        "sourcePaths": [
          "Project Sales Forecasting.ipynb"
        ],
        "sources": [
          {
            "path": "Project Sales Forecasting.ipynb",
            "section": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
            "ref": "f86cd5685efa2f7800aed43e3596eec2909365ff",
            "readStatus": "Relevant code, saved text outputs and markdown inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "What does the chronological evaluation cover?",
        "finding": "The split assigns January–October to training, November to validation and December to test.",
        "population": "304 training days, 30 validation days and 31 test days; lag features leave 276 RF training days.",
        "decision": "Tune on November, then refit on January–November for December evaluation.",
        "limitation": "Full-year exploratory analyses occur before the split, so model design was not entirely blind to the test period.",
        "sourcePaths": [
          "Project Sales Forecasting.ipynb"
        ],
        "sources": [
          {
            "path": "Project Sales Forecasting.ipynb",
            "section": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
            "ref": "f86cd5685efa2f7800aed43e3596eec2909365ff",
            "readStatus": "Relevant code, saved text outputs and markdown inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "What information is available during prediction?",
        "finding": "Default RF records 7.60% one-step validation MAPE with actual lags, versus 10.20% in recursive mode.",
        "population": "November validation, 30 days.",
        "decision": "Use recursive prediction when evaluating a month without new actual observations.",
        "limitation": "The two values answer different horizon questions; neither is December test performance.",
        "sourcePaths": [
          "Project Sales Forecasting.ipynb"
        ],
        "sources": [
          {
            "path": "Project Sales Forecasting.ipynb",
            "section": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
            "ref": "f86cd5685efa2f7800aed43e3596eec2909365ff",
            "readStatus": "Relevant code, saved text outputs and markdown inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Does a validation winner remain strongest after a demand shift?",
        "finding": "Tuned recursive RF records 8.32% validation MAPE, but 26.11% on December test; naive records 25.65% on that test.",
        "population": "November and December are different periods, not a controlled before/after improvement.",
        "decision": "Make baseline comparison and systematic underprediction part of the result.",
        "limitation": "Promotions or holidays are possible explanations, not demonstrated causes without external data.",
        "sourcePaths": [
          "Project Sales Forecasting.ipynb"
        ],
        "sources": [
          {
            "path": "Project Sales Forecasting.ipynb",
            "section": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
            "ref": "f86cd5685efa2f7800aed43e3596eec2909365ff",
            "readStatus": "Relevant code, saved text outputs and markdown inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      }
    ],
    "experiments": [
      "Compare naive, seasonal naive, Holt-Winters, SARIMA and Random Forest. The recorded RF selection uses 200 estimators, max_depth=5 and min_samples_leaf=2.",
      "The section titled January 2020 forecasting actually contains December test evaluation code and outputs. No January forecast is claimed here."
    ],
    "results": [
      {
        "metric": "Recursive validation MAPE",
        "value": 8.32,
        "unit": "%",
        "split": "November 2019 validation",
        "sampleSize": 30,
        "modelVersion": "RF tuned: 200 trees, depth 5, leaf 2",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Validation selection result; not test performance.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "Tuned Random Forest",
        "sampleUnit": "days"
      },
      {
        "metric": "Recursive test MAPE",
        "value": 26.11,
        "unit": "%",
        "split": "December 2019 test",
        "sampleSize": 31,
        "modelVersion": "RF tuned; refit Jan–Nov",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Mean absolute percentage error for daily unique order counts.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "Tuned Random Forest",
        "sampleUnit": "days"
      },
      {
        "metric": "Test MAPE",
        "value": 25.65,
        "unit": "%",
        "split": "December 2019 test",
        "sampleSize": 31,
        "modelVersion": "Naive last-value baseline",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Same recorded test period as RF.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "Naive last-value baseline",
        "sampleUnit": "days"
      },
      {
        "metric": "Test MAPE",
        "value": 26.47,
        "unit": "%",
        "split": "December 2019 test",
        "sampleSize": 31,
        "modelVersion": "SARIMA tuned",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Same recorded test period.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "SARIMA tuned",
        "sampleUnit": "days"
      },
      {
        "metric": "Test MAPE",
        "value": 26.81,
        "unit": "%",
        "split": "December 2019 test",
        "sampleSize": 31,
        "modelVersion": "Seasonal naive",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Same recorded test period.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "Seasonal naive",
        "sampleUnit": "days"
      },
      {
        "metric": "Test MAPE",
        "value": 27.3,
        "unit": "%",
        "split": "December 2019 test",
        "sampleSize": 31,
        "modelVersion": "Holt-Winters tuned",
        "evidenceStatus": "recorded",
        "sourcePath": "Project Sales Forecasting.ipynb",
        "context": "Same recorded test period.",
        "source": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "sourceSection": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "decimals": 2,
        "displayLabel": "Holt-Winters tuned",
        "sampleUnit": "days"
      }
    ],
    "workflow": [
      {
        "label": "Forecasting experiment",
        "flow": "Clean transaction lines → daily unique orders → chronological split → lag features + model comparison → recursive forecast → error review"
      }
    ],
    "lessons": [
      "The December evaluation shows systematic underprediction across the compared models. A stronger November result does not guarantee performance under a later level shift.",
      "No statistical significance claim is supported by the displayed score differences.",
      "Only one year is studied; seasonal explanations and generalization across years remain limited."
    ],
    "nextSteps": [
      "Add rolling-origin evaluation across multiple periods and compare forecast horizons consistently.",
      "Collect additional years and verified external demand drivers before testing calendar or promotion hypotheses."
    ],
    "sources": [
      {
        "path": "Project Sales Forecasting.ipynb",
        "section": "Sections 3, 5.1 cell df51fb7c, 6.1.6, 6.2.5 cell d8473b26, 6.3, section titled 6.4 cell 4d6509b7",
        "ref": "f86cd5685efa2f7800aed43e3596eec2909365ff",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/Sales-Forecasting-Project/blob/f86cd5685efa2f7800aed43e3596eec2909365ff/Project%20Sales%20Forecasting.ipynb",
        "evidenceStatus": "recorded",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/Sales-Forecasting-Project",
    "checkedAt": "2026-10-17",
    "contribution": "I cleaned transaction records, built the daily-order series, compared forecast methods, and reviewed the difference between validation and December test errors."
  },
  "churn": {
    "summary": "A compact learning case on data validity, class imbalance and the evaluation corrections needed before a churn model can support decisions.",
    "subtitle": "Learning case · Classification · Evaluation needs revision",
    "exploration": [
      {
        "question": "Which fields need validity checks before modeling?",
        "finding": "The notebook checks missing and invalid Gender/Age values, then retains 9,996 rows after age filtering.",
        "population": "Initial bank churn table: 10,000 rows and 14 columns.",
        "decision": "Review schema, ranges, missing values and feature encoding before model comparison.",
        "limitation": "Notebook execution state and Gender-mapping inconsistencies require a clean rerun.",
        "sourcePaths": [
          "Output SERKOM.ipynb"
        ],
        "sources": [
          {
            "path": "Output SERKOM.ipynb",
            "section": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
            "ref": "41ba21a6f73c6b30e29bfa8f37fea675e7bc3034",
            "readStatus": "Relevant source and saved outputs inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Can overall accuracy conceal missed churn cases?",
        "finding": "After filtering, the saved class counts are 7,960 non-churn and 2,036 churn.",
        "population": "9,996 retained records.",
        "decision": "Read precision, recall and F1 alongside accuracy.",
        "limitation": "The optimized XGBoost output has recall 0.511057; the notebook result is not deployment-quality evidence.",
        "sourcePaths": [
          "Output SERKOM.ipynb"
        ],
        "sources": [
          {
            "path": "Output SERKOM.ipynb",
            "section": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
            "ref": "41ba21a6f73c6b30e29bfa8f37fea675e7bc3034",
            "readStatus": "Relevant source and saved outputs inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      },
      {
        "question": "Does the preprocessing preserve evaluation boundaries?",
        "finding": "Imputation and MinMaxScaler are applied before the train/test split; a second StandardScaler is fitted after splitting.",
        "population": "Canonical notebook preprocessing and modeling cells.",
        "decision": "A follow-up pipeline should fit all learned preprocessing only on training data and within CV folds.",
        "limitation": "The second scaler does not repair the earlier information leakage. This correction is proposed, not already implemented.",
        "sourcePaths": [
          "Output SERKOM.ipynb"
        ],
        "sources": [
          {
            "path": "Output SERKOM.ipynb",
            "section": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
            "ref": "41ba21a6f73c6b30e29bfa8f37fea675e7bc3034",
            "readStatus": "Relevant source and saved outputs inspected through public raw notebook; revision pinned in ref and source URL",
            "url": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
            "evidenceStatus": "recorded"
          }
        ]
      }
    ],
    "experiments": [
      "The notebook compares Logistic Regression, Random Forest and XGBoost, followed by Random Forest GridSearchCV and XGBoost RandomizedSearchCV.",
      "The reported ROC-AUC uses hard predicted labels. It should not be presented as a probability-based ranking ROC-AUC; CV scoring=\"roc_auc\" is a different computation."
    ],
    "results": [
      {
        "metric": "Notebook-reported precision",
        "value": 0.866667,
        "unit": "fraction",
        "split": "80/20 stratified notebook split",
        "sampleSize": 2000,
        "modelVersion": "Optimized XGBoost",
        "evidenceStatus": "recorded",
        "sourcePath": "Output SERKOM.ipynb",
        "context": "Saved result; preprocessing occurs before split, so interpretation is limited.",
        "source": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
        "sourceSection": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
        "decimals": 4,
        "displayLabel": "Optimized XGBoost"
      },
      {
        "metric": "Notebook-reported recall",
        "value": 0.511057,
        "unit": "fraction",
        "split": "80/20 stratified notebook split",
        "sampleSize": 2000,
        "modelVersion": "Optimized XGBoost",
        "evidenceStatus": "recorded",
        "sourcePath": "Output SERKOM.ipynb",
        "context": "Saved result; churn is the positive class. Test size inferred from 9,996 rows and test_size=0.2.",
        "source": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
        "sourceSection": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
        "decimals": 4,
        "displayLabel": "Optimized XGBoost"
      },
      {
        "metric": "Notebook-reported F1",
        "value": 0.642968,
        "unit": "fraction",
        "split": "80/20 stratified notebook split",
        "sampleSize": 2000,
        "modelVersion": "Optimized XGBoost",
        "evidenceStatus": "recorded",
        "sourcePath": "Output SERKOM.ipynb",
        "context": "Saved output, not independently reproduced.",
        "source": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
        "sourceSection": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
        "decimals": 4,
        "displayLabel": "Optimized XGBoost"
      }
    ],
    "workflow": [
      {
        "label": "Recorded learning workflow",
        "flow": "Validity checks → imputation + scaling before split → stratified split → model comparison → CV search → saved evaluation"
      }
    ],
    "lessons": [
      "The preprocessing order needs correction before claiming leakage-free evaluation.",
      "The variable missing_values is used without a visible definition; execution counts are not sequential. Run All was not performed.",
      "No SHAP implementation was found in the canonical notebook."
    ],
    "nextSteps": [
      "Rebuild preprocessing and model selection in a train-only pipeline and rerun from a clean kernel.",
      "Use predict_proba or decision scores for ROC-AUC, inspect precision–recall trade-offs, and select thresholds with validation data."
    ],
    "sources": [
      {
        "path": "Output SERKOM.ipynb",
        "section": "Validity cells; age filter 887517ab-c92c-49be-b11b-48175a9fd9ce; class counts 3da186da-aa0f-477c-8f7d-ecf9cb0f5448; optimized evaluation d87cf0d8-eecf-48b9-b879-2b6af6885c8e",
        "ref": "41ba21a6f73c6b30e29bfa8f37fea675e7bc3034",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction/blob/41ba21a6f73c6b30e29bfa8f37fea675e7bc3034/Output%20SERKOM.ipynb",
        "evidenceStatus": "recorded",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/Test_BankCustomerChurnPrediction",
    "checkedAt": "2026-10-17",
    "contribution": "I explored data validity and class balance and compared classification models. This learning case also documents evaluation issues that remain to be corrected."
  },
  "butterfly": {
    "summary": "An implementation overview of a butterfly image classifier, focused on the input contract, class-index consistency and model loading.",
    "subtitle": "Implementation overview · Computer vision · Training evidence pending",
    "exploration": [
      {
        "question": "What must remain consistent between input and model?",
        "finding": "The inference function converts images to RGB, resizes to 128 × 128 with nearest interpolation and divides float32 pixels by 255.",
        "population": "Uploaded image inference path.",
        "decision": "Keep preprocessing explicit and consistent with the expected input contract.",
        "limitation": "Training parity is described in source comments; the original training notebook was not available to verify that claim.",
        "sourcePaths": [
          "portfolio/lib/butterfly.py"
        ],
        "sources": [
          {
            "path": "portfolio/lib/butterfly.py",
            "section": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
            "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
            "readStatus": "Implementation source inspected on public GitHub",
            "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
            "evidenceStatus": "implementation-verified"
          }
        ]
      },
      {
        "question": "How are output indices interpreted?",
        "finding": "The source defines an ordered list of 75 output labels, and maps argmax indices through that list.",
        "population": "CNN output head and inference label mapping.",
        "decision": "Preserve exact label ordering and spelling when loading or updating weights.",
        "limitation": "The list proves output vocabulary, not measured recognition quality or calibrated confidence.",
        "sourcePaths": [
          "portfolio/lib/butterfly.py"
        ],
        "sources": [
          {
            "path": "portfolio/lib/butterfly.py",
            "section": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
            "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
            "readStatus": "Implementation source inspected on public GitHub",
            "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
            "evidenceStatus": "implementation-verified"
          }
        ]
      },
      {
        "question": "What happens when the saved model cannot load directly?",
        "finding": "The loader first calls load_model, then reconstructs the architecture and loads weights from the .keras archive as a fallback.",
        "population": "Streamlit application implementation.",
        "decision": "Keep loading failures explicit and isolate the inference dependency from the rest of the page.",
        "limitation": "The fallback path was inspected in code, not executed or proven numerically equivalent in this audit.",
        "sourcePaths": [
          "portfolio/lib/butterfly.py"
        ],
        "sources": [
          {
            "path": "portfolio/lib/butterfly.py",
            "section": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
            "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
            "readStatus": "Implementation source inspected on public GitHub",
            "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
            "evidenceStatus": "implementation-verified"
          }
        ]
      }
    ],
    "experiments": [
      "The UI contains hardcoded configuration scores and training curves described as copied from a notebook. Those secondary values are not promoted to a verified training benchmark."
    ],
    "results": [
      {
        "metric": "Output labels",
        "value": 75,
        "unit": "labels",
        "split": "Inference implementation",
        "sampleSize": null,
        "modelVersion": "CNN label vocabulary",
        "evidenceStatus": "implementation-verified",
        "sourcePath": "portfolio/lib/butterfly.py",
        "context": "Implementation count, not model accuracy.",
        "source": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
        "sourceSection": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
        "decimals": 4,
        "displayLabel": "CNN label vocabulary"
      },
      {
        "metric": "Image input dimensions",
        "value": "128 × 128",
        "unit": "pixels",
        "split": "Inference preprocessing",
        "sampleSize": null,
        "modelVersion": "RGB float32 input",
        "evidenceStatus": "implementation-verified",
        "sourcePath": "portfolio/lib/butterfly.py",
        "context": "Nearest-neighbor resize followed by division by 255.",
        "source": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
        "sourceSection": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
        "decimals": 4,
        "displayLabel": "RGB float32 input"
      }
    ],
    "workflow": [
      {
        "label": "Implemented inference path",
        "flow": "Image upload → RGB + resize + scale → model loading → CNN output → class-index mapping → ranked labels / CSV"
      }
    ],
    "delivery": [
      "The Streamlit page implements multi-image upload, ranked output display and CSV export. Availability of code does not verify a live deployment."
    ],
    "lessons": [
      "Performance claims remain withheld until the original training notebook, split definitions and model artifacts can be linked.",
      "Softmax outputs are model scores and have not been shown to be calibrated probabilities."
    ],
    "nextSteps": [
      "Publish the training notebook with saved outputs, dataset and split documentation, class-index mapping and artifact version.",
      "Add a fresh-load preprocessing parity check and independent labeled evaluation before presenting performance headlines."
    ],
    "sources": [
      {
        "path": "portfolio/lib/butterfly.py",
        "section": "KELAS, KONFIGURASI, _bangun_arsitektur, muat_model, siapkan_gambar, prediksi_massal",
        "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/lib/butterfly.py",
        "evidenceStatus": "implementation-verified",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "portfolio/pages/4_Butterfly_CNN.py",
        "section": "Upload, optional model dependency, ranked output and CSV download",
        "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/portfolio/pages/4_Butterfly_CNN.py",
        "evidenceStatus": "implementation-verified",
        "checkedAt": "2026-10-17"
      },
      {
        "path": "README.md",
        "section": "Butterfly project overview",
        "ref": "0afac782a1a3945f7cd6e62a0e26086fe2886478",
        "readStatus": "Pinned source opened; relevant source and saved outputs checked; no execution",
        "url": "https://github.com/Gidion123/streamlit-portfolio/blob/0afac782a1a3945f7cd6e62a0e26086fe2886478/README.md",
        "evidenceStatus": "source-inspected",
        "checkedAt": "2026-10-17"
      }
    ],
    "repo": "https://github.com/Gidion123/streamlit-portfolio",
    "checkedAt": "2026-10-17",
    "contribution": "This case describes the portfolio application’s inference implementation. Training claims are withheld until the original experiment and model provenance can be checked.",
    "resultNote": "These are code-level input/output contracts. No independently checked training-performance result is presented."
  }
};
const caseVisuals = {
  "jobfit": {
    "title": "Ranking the same held-out profiles",
    "metric": "Macro P@5 · ranking score, higher is better",
    "max": 1,
    "rows": [
      [
        "Stage-1 order",
        0.5333333333333333
      ],
      [
        "Final order",
        0.7333333333333334
      ]
    ],
    "digits": 4,
    "scope": "Three synthetic held-out CV profiles (CV3–CV5), one recorded run each. Final order includes fallback and holds.",
    "explanation": "This is a small paired ranking experiment. NDCG@10 has a different denominator: only CV3 and CV4 are eligible.",
    "sourcePath": "evals/results/cp24/heldout_report_v1.json"
  },
  "stock-rag": {
    "title": "A plausible candidate that was rejected",
    "metric": "HitRate@8 · fraction of in-scope questions, higher is better",
    "max": 1,
    "rows": [
      [
        "Similarity baseline",
        0.8571428571428571
      ],
      [
        "Neighbor candidate",
        0.75
      ]
    ],
    "digits": 4,
    "scope": "Same development benchmark C, fingerprint eeae64b5f63f; 28 in-scope questions from 33 total.",
    "explanation": "The same-page neighbor candidate lost more hits than it recovered. These CLI retrieval results do not measure factual-answer accuracy or every session path.",
    "sourcePath": "evaluation/results/retrieval_experiment.json"
  },
  "house-mlops": {
    "title": "Small gain, added complexity",
    "metric": "Same-contract five-fold CV RMSE_log · lower is better",
    "max": 0.15,
    "rows": [
      [
        "Single XGBoost",
        0.12581
      ],
      [
        "80/20 blend",
        0.12522
      ]
    ],
    "digits": 5,
    "scope": "Same 20-field API contract and five folds; 1,168 training rows.",
    "explanation": "About 0.47% lower CV error did not meet the project’s 1% complexity threshold. Single XGBoost was retained. This is not a significance test.",
    "sourcePath": "notebooks/01_experiment.ipynb"
  },
  "smartsplit": {
    "title": "Reader quality needs more than a total",
    "metric": "Mean item F1 · higher is better",
    "max": 1,
    "rows": [
      [
        "DeepSeek cloud reader",
        0.8386021872863978
      ],
      [
        "Donut CORD-v2",
        0.45858789358789354
      ],
      [
        "Qwen3-VL-2B-Instruct",
        0.8207017543859649
      ]
    ],
    "digits": 3,
    "scope": "20 receipt images; field metrics use the first successful result per receipt. Cloud ran once per receipt; local models three times.",
    "explanation": "F1 uses greedy item-name matching. Monetary matching permits an absolute difference of up to 1 rupiah. Final-total agreement does not imply all receipt fields are correct.",
    "sourcePath": "research/results/accuracy.csv"
  },
  "recommender": {
    "title": "The baseline belongs in the comparison",
    "metric": "Held-out liked movie found in top five · hits, higher is better",
    "max": 40,
    "rows": [
      [
        "Popularity by count",
        31
      ],
      [
        "Item CF",
        17
      ],
      [
        "Single-seed hybrid",
        15
      ],
      [
        "Popularity by mean",
        8
      ]
    ],
    "digits": 0,
    "scope": "609 eligible users in recorded leave-one-out evaluation. Candidate filtering differs across methods.",
    "explanation": "Hybrid alpha=0.5 does not win here. The separate full-profile alpha sweep is not pooled with these results; this is not an unbiased final benchmark.",
    "sourcePath": "project_recom_system.ipynb"
  },
  "forecasting": {
    "title": "December changed the picture",
    "metric": "December test MAPE · %, lower is better",
    "max": 30,
    "rows": [
      [
        "Naive",
        25.65
      ],
      [
        "Tuned RF",
        26.11
      ],
      [
        "Tuned SARIMA",
        26.47
      ],
      [
        "Seasonal naive",
        26.81
      ],
      [
        "Tuned Holt-Winters",
        27.3
      ]
    ],
    "digits": 2,
    "scope": "31 December 2019 test days; target is daily unique order count.",
    "explanation": "Tuned recursive RF validation MAPE was 8.32% over November’s 30 days. That different period is not an equivalent test result.",
    "sourcePath": "Project Sales Forecasting.ipynb"
  },
  "retail": {
    "title": "Product revenue is concentrated",
    "metric": "Share of net product revenue · %",
    "max": 100,
    "rows": [
      [
        "Top 760 products (20%)",
        77.91
      ],
      [
        "Remaining 3,040 (80%)",
        22.09
      ]
    ],
    "digits": 2,
    "scope": "3,800 product-name groups; excludes shipping and discount transactions. Net-revenue denominator: £9,772,003.97.",
    "explanation": "Prioritize stock and margin review for the core product group. Historical concentration supports a proposed action; it does not measure sales uplift.",
    "sourcePath": "project_eda.ipynb",
    "sourceSection": "Zero-based cell 176 / 6faebc39; denominator c8e468a1. Commit 9101505b3beb."
  }
};
function evidenceChart(c,project){
 const val=n=>Number(n).toFixed(c.digits??4);
 return `<figure class="evidence-chart"><figcaption><h3>${text(c.title)}</h3><p>${text(c.metric)}</p></figcaption><div class="chart-bars" aria-hidden="true">${c.rows.map(([label,value])=>`<div class="chart-row"><span>${text(label)}</span><div class="chart-track"><div class="chart-fill" style="width:${Math.max(0,Math.min(100,value/c.max*100))}%"></div></div><strong>${val(value)}</strong></div>`).join('')}<div class="chart-axis"><span>0</span><span>${c.max}</span></div></div><div class="table-wrap"><table class="evidence-table"><caption>Data alternative · ${text(c.metric)}</caption><thead><tr><th scope="col">Configuration</th><th scope="col">Value</th></tr></thead><tbody>${c.rows.map(([label,value])=>`<tr><th scope="row">${text(label)}</th><td>${val(value)}</td></tr>`).join('')}</tbody></table></div><p class="evidence-context">${text(c.scope)}</p><p class="evidence-context">${text(c.explanation)}</p><p class="case-source">${sourceLink(project,c.sourcePath,'Chart source')} ${text(c.sourceSection||'')}</p></figure>`;
}
