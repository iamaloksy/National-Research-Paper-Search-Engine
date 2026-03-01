# TITLE PAGE FORMAT

## PROJECT TITLE

# National Research Paper Search Engine (NRPSE)

## Project Report

Submitted in partial fulfillment of the requirements for the award of degree of  
**<Degree Name>**

Submitted By: ____________________  
Roll No: ____________________  
Reg No: ____________________  
Under the Guidance of: ____________________

School/Department Name  
University Name  
Academic Session: __________

\newpage

# CERTIFICATE

This is to certify that the project titled  
“**National Research Paper Search Engine (NRPSE)**”

was carried out by ____________________ under my supervision, as part of the requirements for the degree of ____________________ from ____________________ for the academic year __________.

The work in this report is original and has not been submitted to any other university or institution for any degree or diploma.

Guide Name: ____________________  
Designation: ____________________  
Signature of Guide: ______________

Head of Department: ______________  
Signature: ______________________

Date: __________  
Place: __________

\newpage

# DECLARATION

I hereby declare that the project titled  
“**National Research Paper Search Engine (NRPSE)**”

submitted by me is an original work done under the supervision of ____________________.

I also declare that this project has not been submitted to this university or any other university/institution in whole or in part for the award of any degree/diploma.

All sources and references used in this project have been duly acknowledged.

Name: ____________________  
Roll No: ____________________  
Signature: ____________________  
Date: ____________________  
Place: ____________________

\newpage

# ACKNOWLEDGEMENT

I would like to express my sincere gratitude to my project guide ____________________ for their valuable guidance and continuous support throughout the project work.

I would also like to thank the Head of the Department and faculty members of ____________________ for providing the necessary facilities and encouragement.

I extend my gratitude to my friends, classmates, and family members for their support and motivation.

Name: ____________________

\newpage

# TABLE OF CONTENTS FORMAT

ABSTRACT .............................................................................. ___

CHAPTER 1: INTRODUCTION ............................................. ___  
1.1 Background ....................................................................... ___  
1.2 Problem Statement ............................................................ ___  
1.3 Objectives of the Project .................................................. ___  
1.4 Scope of the Study ........................................................... ___  
1.5 Structure of the Report ..................................................... ___

CHAPTER 2: LITERATURE REVIEW .................................. ___  
2.1 Introduction ....................................................................... ___  
2.2 Review of Existing Systems ............................................. ___  
2.3 Comparative Analysis ....................................................... ___  
2.4 Research Gap .................................................................... ___

CHAPTER 3: PROPOSED SYSTEM ...................................... ___  
3.1 Introduction ....................................................................... ___  
3.2 System Architecture .......................................................... ___  
3.3 Modules Description ......................................................... ___  
3.4 Data Flow Diagram ........................................................... ___  
3.5 Advantages of Proposed System ....................................... ___

CHAPTER 4: METHODOLOGY ............................................ ___  
4.1 Data Collection .................................................................. ___  
4.2 Data Preprocessing ............................................................ ___  
4.3 Feature Extraction ............................................................. ___  
4.4 Algorithm Design .............................................................. ___  
4.5 Experimental Setup .......................................................... ___

CHAPTER 5: IMPLEMENTATION ....................................... ___  
5.1 Tools and Technologies Used ........................................... ___  
5.2 Backend Implementation .................................................. ___  
5.3 Frontend Implementation .................................................. ___  
5.4 Database Design ............................................................... ___

CHAPTER 6: RESULTS AND PERFORMANCE ANALYSIS ___  
6.1 Evaluation Metrics ........................................................... ___  
6.2 Experimental Results ........................................................ ___  
6.3 Comparative Analysis ....................................................... ___

CHAPTER 7: SECURITY AND SCALABILITY ...................... ___  
7.1 Security Measures ............................................................. ___  
7.2 Scalability Strategy ........................................................... ___

CHAPTER 8: LIMITATIONS .................................................. ___

CHAPTER 9: FUTURE SCOPE ............................................. ___

CHAPTER 10: CONCLUSION .............................................. ___

ABBREVIATIONS .................................................................... ___

REFERENCES ......................................................................... ___

ANNEXURES .......................................................................... ___

\newpage

# ABSTRACT

The rapid growth of scholarly publications has made manual research paper discovery inefficient and error-prone for students, faculty, and independent researchers. Conventional search methods often suffer from fragmented indexing, weak filtering options, poor relevance ranking, and minimal support for institutional content governance. In many educational contexts, users cannot quickly identify high-quality papers by domain, source, year, or thematic relevance. This problem leads to duplicated effort, incomplete literature review, and reduced research productivity.

The present work proposes and implements the **National Research Paper Search Engine (NRPSE)**, a web-based searchable repository designed to improve academic information retrieval using modern full-text techniques and scalable cloud infrastructure. The system combines a responsive React-based user interface with a Supabase/PostgreSQL backend, full-text indexing, relevance scoring, advanced filters, and an authenticated administration module for controlled dataset management.

The proposed solution includes: (i) multi-field query search (title, authors, abstract, all fields), (ii) faceted filtering (source, domain, year range), (iii) sorting mechanisms (relevance, year ascending/descending, title A–Z), (iv) paginated output for efficient browsing, and (v) visual statistical dashboard cards/charts for repository-level insights. The administrative console supports secure login, role validation, CSV ingestion, de-duplication using generated hash keys, bulk deletion workflows, and progress feedback.

Implementation technologies include **TypeScript, React, Vite, Tailwind CSS, shadcn/ui, Supabase Auth, Supabase Edge Functions, PostgreSQL full-text search, and React Query**. Dataset ingestion was facilitated through CSV metadata pipelines, including automated arXiv metadata extraction. The architecture is designed for reliability and maintainability, with row-level security policies and role-based controls.

Performance evaluation demonstrates improved retrieval efficiency with structured filtering and query execution over indexed metadata. Empirical analysis indicates that the search interface supports practical exploration of large publication datasets while reducing irrelevant result sets. The deduplication strategy prevents data inflation and improves corpus consistency.

The key contribution of this project is an end-to-end academic search platform that balances usability, relevance, administrative control, and extensibility. The system establishes a practical baseline for institutional research repositories and can be extended with semantic search, recommendation systems, citation network analytics, and multilingual support.

**Keywords:** Research Paper Search, Full-Text Search, Academic Information Retrieval, Supabase, PostgreSQL, React, Role-Based Access Control, De-duplication

\newpage

# PROBLEM STATEMENT FORMAT

## Clearly describe:

### • Existing problem
Academic users often depend on fragmented digital libraries, static PDFs, and general-purpose web search for finding research papers. As a result, the literature discovery process is slow, repetitive, and difficult to validate. Existing generic search systems do not always provide institution-specific indexing, controlled data quality, or customizable relevance behavior.

### • Limitations of current systems
1. Limited filter granularity for domain-specific discovery.
2. Inconsistent metadata quality in open-indexed systems.
3. Lack of integrated admin workflows for controlled data ingestion.
4. Weak duplicate handling in many simple repository implementations.
5. Poor usability in low-resource academic settings due to cluttered interfaces.
6. Lack of transparent role-based governance for who can add/delete records.

### • Why improvement is required
A robust academic search platform is required to reduce effort during literature review, accelerate project ideation, and improve the quality of research outcomes. Institutions need a system where paper metadata can be curated and maintained securely while remaining searchable to public users.

### • What gap your project fills
NRPSE fills the gap between large open repositories and local institutional needs by combining:
- full-text ranking,
- strict role-based administration,
- CSV-based bulk ingestion,
- deterministic de-duplication,
- and user-friendly faceted retrieval in one unified platform.

\newpage

# OBJECTIVES FORMAT

## • Objective 1
Design and implement a responsive web interface for searching research papers across title, authors, and abstract fields.

## • Objective 2
Develop a scalable backend data model and query layer supporting filtering, sorting, relevance ranking, and pagination.

## • Objective 3
Implement secure administration workflows with authentication, authorization, and controlled data operations.

## • Objective 4
Enable bulk CSV ingestion with validation, normalization, and duplicate elimination using a hash-based strategy.

## • Objective 5
Analyze system performance and usability through retrieval metrics, operational behavior, and comparative observations.

\newpage

# ABBREVIATIONS FORMAT

API – Application Programming Interface  
CSV – Comma-Separated Values  
DBMS – Database Management System  
DFD – Data Flow Diagram  
ERT – Entity Relationship Technique  
FTR – Full-Text Retrieval  
GIN – Generalized Inverted Index  
HTTP – HyperText Transfer Protocol  
IR – Information Retrieval  
JSON – JavaScript Object Notation  
KPI – Key Performance Indicator  
MVP – Minimum Viable Product  
NRPSE – National Research Paper Search Engine  
RBAC – Role-Based Access Control  
RLS – Row Level Security  
RPC – Remote Procedure Call  
SQL – Structured Query Language  
UI – User Interface  
UX – User Experience

\newpage

# CHAPTER 1: INTRODUCTION

## 1.1 Background
In the digital era, scientific and technical publications are generated at an unprecedented rate. Every research area—including computer science, physics, mathematics, statistics, economics, and interdisciplinary domains—publishes thousands of papers annually. For learners and researchers, the challenge is no longer access alone, but **effective retrieval** of relevant, recent, and credible papers.

Traditional approaches to discovering papers involve manually browsing publisher websites, searching general engines, or collecting links from references. This process is often fragmented and non-repeatable. Even when users access open repositories, they may encounter irrelevant results due to weak search semantics, limited filters, and inconsistent metadata structures. In academic institutions, this challenge is amplified because each department may need domain-prioritized paper exploration with predictable quality.

NRPSE is conceived as a focused search application that addresses these retrieval and governance challenges. It prioritizes practical usage: fast lookup, rich filters, relevance-oriented ranking, and secure administration over indexed metadata. The project integrates modern front-end and backend technologies to build a complete research-paper discovery platform from ingestion to retrieval.

## 1.2 Problem Statement
Despite multiple global repositories, students and early-stage researchers face the following barriers:
1. Difficulty in narrowing search by exact domain/source/time constraints.
2. Inability to trust metadata quality due to duplicates or noisy records.
3. No centralized departmental control over what enters the searchable index.
4. High time cost in literature survey due to non-actionable result lists.
5. Lack of transparent admin controls and safe deletion workflows.

The problem therefore is to develop an efficient, scalable, and secure research paper search engine that supports both end-user discovery and administrative dataset governance.

## 1.3 Objectives of the Project
The project aims to:
- build a searchable and filterable paper repository;
- implement full-text retrieval for improved relevance;
- provide visual analytics of indexed papers by source/domain;
- support role-based admin login and controlled content management;
- ensure consistency through de-duplication and normalized metadata.

## 1.4 Scope of the Study
The scope of this work includes:
- Metadata-based retrieval (not full PDF content indexing).
- Public read access to paper records.
- Admin-only insertion and deletion operations.
- CSV-based dataset onboarding and incremental updates.
- Cloud-native deployment architecture using Supabase.
- Frontend-first UX for discovery and navigation.

Out of scope:
- Full citation graph visualization.
- In-browser PDF annotation and reference manager integration.
- AI summarization of every paper abstract.
- Personalized recommender engine (future work).

## 1.5 Structure of the Report
This report is organized into ten chapters. Chapter 1 introduces context and objectives. Chapter 2 reviews related systems and identifies gaps. Chapter 3 describes the proposed architecture and module-level design. Chapter 4 explains methodology including data collection and algorithmic flow. Chapter 5 documents implementation details. Chapter 6 presents results and comparative observations. Chapter 7 addresses security and scalability. Chapters 8 and 9 discuss limitations and future enhancements. Chapter 10 concludes the study with key outcomes.

\newpage

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Introduction
Literature review in information retrieval systems emphasizes three central dimensions: indexing quality, query relevance, and user interaction design. For academic search systems, additional dimensions include metadata integrity, source trust, and governance controls for curation. The current chapter reviews existing categories of systems and maps their strengths and limitations to the problem addressed by NRPSE.

## 2.2 Review of Existing Systems

### 2.2.1 General-Purpose Search Engines
General web search engines provide broad indexing and high availability, but they are not optimized for structured academic metadata retrieval. Query intent is often interpreted using ranking signals that prioritize popularity over research relevance. Filters for publication source, domain hierarchy, and structured year range can be inconsistent.

### 2.2.2 Academic Search Portals
Dedicated academic portals offer better scholarly focus and citation context. However, they may have one or more constraints:
- subscription restrictions;
- inconsistent access across institutions;
- opaque ranking logic;
- poor customization for local repository objectives.

### 2.2.3 Institutional Repositories
Many institutions host digital repositories that provide controlled collections and persistent records. Yet these systems can be limited by:
- older search interfaces,
- weak full-text ranking,
- lack of operational tooling for bulk ingestion/de-duplication,
- and limited responsive UX.

### 2.2.4 Open Metadata Aggregators
Open datasets (for example, preprint repositories) provide high-volume metadata and machine-readable feeds. While useful for data acquisition, they generally do not solve downstream institutional needs such as custom filtering policies, role-based admin workflows, and integrated analytics.

## 2.3 Comparative Analysis

| Parameter | Generic Web Search | Academic Portals | Institutional Repos | NRPSE |
|---|---|---|---|---|
| Scholarly Focus | Low to Medium | High | Medium | High |
| Controlled Data Ingestion | No | Limited | Medium | Yes |
| Role-Based Admin | No | Limited | Limited | Yes |
| Full-Text Relevance Control | Limited | Medium | Limited | Yes |
| CSV Bulk Import | No | No | Sometimes | Yes |
| Duplicate Handling | Unknown | Unknown | Limited | Hash-based |
| Source/Domain Filters | Limited | Medium | Medium | Strong |
| Modern Responsive UI | Yes | Medium | Often Low | Yes |
| Open Extensibility | Low | Low | Medium | High |

The analysis indicates that most alternatives optimize either public discovery or repository management, but not both simultaneously with modern UX and security governance.

## 2.4 Research Gap
The key research/practice gap identified is the absence of a lightweight, extensible, and secure platform that combines:
1. relevance-based academic search,
2. robust metadata filtering,
3. institutional governance (RBAC + RLS), and
4. practical operations (CSV import, dedupe, batch actions).

NRPSE addresses this gap by integrating these capabilities as first-class features rather than optional add-ons.

\newpage

# CHAPTER 3: PROPOSED SYSTEM

## 3.1 Introduction
The proposed system is a full-stack web application where users can discover papers using search and filters, while authorized administrators can ingest and manage metadata records. It is designed around a clear separation of concerns: user-facing retrieval, backend query intelligence, and admin governance.

## 3.2 System Architecture
The architecture follows a client-cloud model.

### 3.2.1 Presentation Layer
- React + TypeScript based SPA.
- Routes: Home, Search Results, Admin Login, Admin Dashboard.
- Components for search, cards, pagination, charts, and notifications.
- Theme-aware UI with responsive layouts.

### 3.2.2 Application/Data Access Layer
- `lib/api.ts` defines typed interfaces and RPC calls.
- React Query handles async fetching, caching, and stale state management.
- URL query synchronization enables sharable search state.

### 3.2.3 Data and Security Layer
- Supabase/PostgreSQL stores paper metadata.
- SQL functions provide search and analytics.
- Row Level Security enforces access policy.
- Role tables define admin permissions.

### 3.2.4 Processing and Integration Layer
- CSV import and delete operations via UI and edge functions.
- Pre-ingestion normalization and dedupe pipeline.
- Hash-based uniqueness on generated fingerprint (`dedupe_hash`).

## 3.3 Modules Description

### 3.3.1 User Search Module
This module accepts keyword queries and supports field-specific targeting (all/title/authors/abstract). Users can filter by source, domain, and publication year range. Sort options include relevance and chronology. Results are paginated and rendered as cards.

### 3.3.2 Statistics & Visualization Module
The system computes aggregate stats (total papers, source distribution, domain distribution, year range). Charts are rendered for quick understanding of repository composition. Category thresholds prevent noise from very sparse labels.

### 3.3.3 Authentication & Authorization Module
Admin login uses Supabase authentication with email/password. After login, a role lookup against `user_roles` verifies admin privilege. Unauthorized users are prevented from entering the dashboard and may be signed out.

### 3.3.4 Administration Module
The dashboard supports:
- CSV upload (multiple files),
- table browsing and keyword search,
- selective and bulk deletion,
- progress indicators for upload and delete workflows,
- stats refresh through query invalidation.

### 3.3.5 Data Integrity Module
The module ensures consistency by:
- normalizing category/text fields,
- clamping year values to a realistic interval,
- generating deterministic fingerprint hashes,
- and enforcing uniqueness at DB index level.

## 3.4 Data Flow Diagram

### 3.4.1 Level 0 (Context Diagram)
**Actors:** Public User, Admin User, System Database  
**Flow:**
1. User submits search query and filters.
2. System executes search function and returns ranked records.
3. Admin authenticates and uploads CSV.
4. System validates, deduplicates, and stores records.
5. Admin may trigger selective/bulk deletion.

### 3.4.2 Level 1 (Process Decomposition)
- P1: Query Processing and Validation.
- P2: Filtered Retrieval and Ranking.
- P3: Stats Aggregation.
- P4: Admin Authentication + Role Verification.
- P5: CSV Parsing, Normalization, Upsert/Dedupe.
- P6: Delete Pipeline with confirmation and progress tracking.

### 3.4.3 Textual DFD Representation
Input streams include search parameters, auth credentials, and CSV files. Intermediate transformations include parameter sanitization, SQL function invocation, and metadata normalization. Output streams include result lists, chart data, operation status messages, and updated repository states.

## 3.5 Advantages of Proposed System
1. Unified platform for retrieval and governance.
2. Better search precision through field-targeted queries.
3. Improved quality via dedupe and normalized categories.
4. Secure admin control using RBAC and RLS policies.
5. Scalable query execution via DB-side indexing and RPC functions.
6. Better user adoption due to responsive and minimal UI.

\newpage

# CHAPTER 4: METHODOLOGY

## 4.1 Data Collection
The project uses structured metadata collection from research sources, including automated extraction from arXiv feeds. A Python script orchestrates domain-wise collection using API query parameters and stores records in CSV format.

### 4.1.1 Domain-Wise Sampling Strategy
Collection was segmented into broad research domains such as Computer Science, Physics, Mathematics, Statistics, Quantitative Biology, Quantitative Finance, Economics, and Electrical Engineering. This helps maintain topical coverage and supports domain filter usefulness.

### 4.1.2 Batch Acquisition Logic
To prevent overload and improve reliability:
- batched API requests were used (`max_results` windows),
- polite sleep intervals were included,
- malformed batches were skipped safely,
- per-domain CSV files were generated.

### 4.1.3 Metadata Fields Collected
- Title
- Authors
- Abstract
- Year
- Source
- Domain
- URL

## 4.2 Data Preprocessing
Before insertion, metadata undergoes standardized preprocessing:
1. Trimming and whitespace normalization.
2. Default fallbacks for missing fields (e.g., title/source/domain).
3. Year parsing and range clamping to valid bounds.
4. Category normalization to lowercase canonical tokens.
5. Fingerprint generation for dedupe consistency.

### 4.2.1 Motivation for Normalization
Without normalization, near-identical rows can bypass duplicate checks due to casing or spacing differences. The preprocessing strategy ensures deterministic storage behavior and cleaner analytics.

### 4.2.2 Duplicate Handling Mechanism
A generated stored column (`dedupe_hash`) computes md5 hash from normalized fields: title, authors, year, source, domain, and URL. A unique index enforces one canonical record per fingerprint. During CSV upload, both in-file duplicates and pre-existing database duplicates are skipped.

## 4.3 Feature Extraction
This system is metadata-centric. Feature extraction for ranking and filtering includes:
- lexical tokens from title/authors/abstract,
- source and domain categorical values,
- publication year for temporal filtering.

A `tsvector` generated column combines weighted text fields:
- title with highest weight,
- authors with medium weight,
- abstract with lower weight.

This weighting improves practical relevance by prioritizing title matches.

## 4.4 Algorithm Design

### 4.4.1 Search Algorithm
The search pipeline follows:
1. Receive search parameters.
2. Validate and sanitize page and limit bounds.
3. Build conditional predicates for query text and filters.
4. Compute total count for pagination.
5. Fetch result rows with computed relevance score.
6. Sort according to selected mode.
7. Return JSON with page metadata.

### 4.4.2 Sorting Logic
- `relevance`: rank-based ordering using text search score.
- `year_desc`: newest first.
- `year_asc`: oldest first.
- `title_asc`: alphabetical ordering.

### 4.4.3 Adaptive Upload Batching
Large CSV upload uses adaptive batches:
- start at configured batch size,
- on timeout reduce batch size,
- retry transient failures with delay,
- gradually increase size on successful runs.

This strategy improves robustness for variable network/database load conditions.

## 4.5 Experimental Setup

### 4.5.1 Hardware/Software Environment
- Client: modern browser on standard laptop/desktop.
- Frontend runtime: Vite development/build pipeline.
- Backend: Supabase hosted PostgreSQL and serverless functions.
- Language stack: TypeScript, SQL, Python.

### 4.5.2 Dataset Profile
Experimental datasets consisted of domain-tagged paper metadata records imported from CSV collections. Data coverage included multiple sources/domains with mixed publication years to test filtering and chart behavior.

### 4.5.3 Evaluation Focus
- Search responsiveness,
- query relevance quality,
- filter correctness,
- upload/delete operational stability,
- user-level and admin-level access control correctness.

\newpage

# CHAPTER 5: IMPLEMENTATION

## 5.1 Tools and Technologies Used

### 5.1.1 Frontend Stack
- React 18 with TypeScript for component-driven UI.
- Vite for fast build/dev experience.
- Tailwind CSS + shadcn/ui for consistent design primitives.
- React Router for route management.
- React Query for server-state and caching.
- Recharts for visual analytics.

### 5.1.2 Backend Stack
- Supabase Auth for user sessions.
- Supabase PostgreSQL for persistent storage.
- SQL RPC functions (`search_papers`, `get_paper_stats`).
- RLS policies for access control.
- Supabase Edge Functions for admin-specific operations.

### 5.1.3 Data Engineering Utilities
- Python data script for API-based metadata extraction.
- CSV parsing and validation logic in admin workflows.
- Generated hash-based dedupe model.

## 5.2 Backend Implementation

### 5.2.1 Database Functions
The `search_papers` function accepts query text, field selector, filters, sort key, page number, and page size. It calculates total count and returns a JSON envelope containing results and pagination metadata. Relevance is computed via `ts_rank` for full-text search mode.

The `get_paper_stats` function aggregates total records and grouped counts by source and domain, along with min/max year.

### 5.2.2 Access Policies
RLS is enabled on key tables. Public users can read paper records. Insert/update/delete permissions are constrained to authenticated admins via role check helper function. Role management is implemented using an enum-based `app_role` and `user_roles` table.

### 5.2.3 Edge Function Capabilities
- `check-admin`: validates if current authenticated user is admin.
- `import-csv`: validates auth, parses CSV from form data, inserts in batches.
- `delete-papers`: supports targeted deletion or complete purge (admin-only).

### 5.2.4 Reliability Features
- Retry logic for transient upload failures.
- Statement-timeout handling with adaptive batch resizing.
- Clear error responses and progress feedback for long-running operations.

## 5.3 Frontend Implementation

### 5.3.1 Routing
Routes include:
- `/` : Landing + statistics overview.
- `/search` : Search panel + results + pagination.
- `/admin/login` : Admin authentication.
- `/admin` : Admin dashboard.

### 5.3.2 Search Experience
The search page supports:
- keyword input with clear option,
- field selector,
- toggleable advanced filters,
- source/domain drop-downs,
- year range fields,
- sort selector,
- smooth scrolling to results after search/page changes.

### 5.3.3 Result Rendering
Each paper result is displayed as a card with key metadata. Pagination controls enable navigation through result pages. Empty state view is provided when no papers match criteria.

### 5.3.4 Admin Dashboard UX
The dashboard includes:
- paper table view with selection controls,
- search within records,
- CSV uploader (multi-file),
- operation progress bars,
- confirmation dialogs for delete actions,
- periodic stats refresh and query invalidation.

## 5.4 Database Design

### 5.4.1 Core Table: `papers`
**Primary attributes:**
- `id` (bigserial primary key)
- `title`
- `authors`
- `abstract`
- `year`
- `source`
- `domain`
- `url`
- `dedupe_hash` (generated)
- `fts` (generated tsvector)
- timestamps

### 5.4.2 Supporting Tables
- `user_roles` for role mapping.
- `profiles` for user profile metadata.

### 5.4.3 Indexing Strategy
- B-tree indexes on year, source, domain.
- GIN index on `fts` for full-text retrieval.
- Unique index on `dedupe_hash` for duplicate prevention.

### 5.4.4 ER Overview (Textual)
`auth.users` (Supabase managed) has one-to-one with `profiles` and one-to-many with `user_roles` by logical relation. `papers` is independent content table accessed through policy-based controls.

\newpage

# CHAPTER 6: RESULTS AND PERFORMANCE ANALYSIS

## 6.1 Evaluation Metrics
To evaluate NRPSE, multiple dimensions were considered.

### 6.1.1 Functional Metrics
1. Query success rate.
2. Filter correctness.
3. Pagination correctness.
4. Role-check correctness for admin pages.
5. CSV import success and dedupe behavior.

### 6.1.2 Retrieval Quality Metrics
1. Relevance of top-k results.
2. Field-specific precision trend.
3. Reduction in irrelevant results when filters are applied.

### 6.1.3 Operational Metrics
1. Time to load initial stats.
2. Time to fetch one results page.
3. Upload throughput by batch size.
4. Stability under retry scenarios.

## 6.2 Experimental Results

### 6.2.1 Functional Validation Summary
- Search query handling worked for blank and non-blank terms.
- Field selectors changed matching behavior correctly.
- Source/domain/year filters correctly narrowed result sets.
- Sorting modes produced expected ordering patterns.
- Admin role checks blocked unauthorized access.
- CSV import accepted valid files and rejected malformed input.
- Duplicate rows were skipped based on fingerprint uniqueness.

### 6.2.2 Observed Retrieval Behavior
- `all fields` mode performed well for exploratory search.
- `title` mode produced highest precision for targeted keywords.
- Combined filters significantly reduced cognitive noise in results.
- Relevance sorting improved discovery compared to simple chronological lists.

### 6.2.3 Operational Observations
- Query response remained practical for paginated page sizes.
- Chart rendering remained stable with top categories.
- Adaptive batching reduced failures during larger imports.
- Delete workflows completed safely with confirmation steps.

## 6.3 Comparative Analysis

| Criterion | Baseline Simple Repository | NRPSE |
|---|---|---|
| Multi-field Search | Basic | Advanced |
| Full-Text Ranking | No/Weak | Yes |
| Faceted Filters | Limited | Yes |
| Admin Role Guard | Minimal | Strong |
| Dedupe at DB Level | Rare | Yes |
| Upload Resilience | Low | Adaptive |
| UX Responsiveness | Variable | High |
| Analytics Overview | Often absent | Included |

The implementation demonstrates measurable improvement over minimal repository designs by combining retrieval relevance and governance-oriented operations.

\newpage

# CHAPTER 7: SECURITY AND SCALABILITY

## 7.1 Security Measures

### 7.1.1 Authentication and Session Management
Admin access is protected by secure authentication. Session retrieval and validation occur before privileged operations. Invalid sessions are denied and users are redirected to login.

### 7.1.2 Authorization and Role Enforcement
A role-check mechanism verifies whether authenticated users have `admin` role. Authorization is enforced at both application and data policy levels, reducing risk of privilege bypass.

### 7.1.3 Row-Level Security (RLS)
RLS is enabled on critical tables. Policy logic allows public read on papers while restricting write operations to admin users. This principle-of-least-privilege approach helps prevent unauthorized mutation.

### 7.1.4 Input Validation and Sanitization
CSV parsing includes structural checks, required column fallback handling, and safe conversion for year values. Client-side parameters are constrained, and database functions handle sanitized values.

### 7.1.5 Data Integrity Controls
Generated hash keys and unique constraints enforce record uniqueness. Update timestamps and structured schema design improve auditability and consistency.

### 7.1.6 Operational Safeguards
Destructive operations use explicit confirmation dialogs and mode-specific workflows (selected/source/domain/all). Progress states reduce accidental repeated operations.

## 7.2 Scalability Strategy

### 7.2.1 Query Scalability
- Full-text GIN indexing accelerates keyword queries.
- Pagination limits result payload sizes.
- Server-side filtering/sorting reduces client processing overhead.

### 7.2.2 Data Growth Management
- Hash-based dedupe controls storage inflation.
- Batch imports support large incremental onboarding.
- Aggregated stats are computed through DB-level functions.

### 7.2.3 Application Scalability
- Stateless frontend suitable for CDN hosting.
- Backend RPC functions centralize query logic.
- Edge functions can be independently evolved for ingestion pipelines.

### 7.2.4 Horizontal Expansion Possibilities
- Partitioning by year/domain for very large corpora.
- Materialized views for heavy analytics workloads.
- Caching layers for repeated search patterns.
- Queue-based ingestion for massive bulk uploads.

\newpage

# CHAPTER 8: LIMITATIONS

Although NRPSE provides a strong practical baseline, certain limitations remain:

1. **Metadata-only search:** The current system searches metadata fields, not full PDF content or section-level semantics.
2. **Limited semantic understanding:** Query matching is primarily lexical; synonym expansion and semantic embeddings are not yet integrated.
3. **Evaluation depth:** Quantitative IR metrics are presently observational; large benchmark datasets with formal relevance judgments are not fully incorporated.
4. **Single-language bias:** Full-text tokenization is optimized for English; multilingual ranking behavior requires extension.
5. **No citation network analytics:** The current release does not provide citation graph traversal, influence ranking, or bibliometric dashboards.
6. **Admin dependency for curation:** Corpus quality depends on disciplined admin workflows and source CSV quality.
7. **No collaborative annotation features:** Users cannot save reading lists, notes, or collaborative tags yet.
8. **Edge-case CSV variability:** Highly inconsistent CSV schemas may require manual pre-cleaning.

These limitations define clear directions for iterative improvement.

\newpage

# CHAPTER 9: FUTURE SCOPE

The system can be extended in the following high-impact directions:

## 9.1 Semantic and AI-Enhanced Search
- Add vector embeddings for semantic retrieval.
- Support query expansion with domain ontologies.
- Integrate abstract summarization and keyphrase extraction.

## 9.2 Citation Intelligence
- Build citation/reference graph.
- Compute influence indicators (e.g., local centrality scores).
- Provide “related papers” recommendations.

## 9.3 Personalization and Collaboration
- User profiles with saved searches.
- Reading lists and project folders.
- Shared annotations for team-based research groups.

## 9.4 Advanced Data Governance
- Approval workflows for imported datasets.
- Versioned data snapshots and rollback mechanisms.
- Automated quality checks before publish-to-search.

## 9.5 Multilingual and Cross-Domain Expansion
- Tokenizers for multiple languages.
- Transliteration-aware search.
- Domain-specific ranking presets.

## 9.6 Deployment and DevOps Enhancements
- CI/CD with automated migration checks.
- Observability dashboards and alerting.
- Elastic scaling for ingestion and analytics tasks.

## 9.7 Institutional Integration
- LMS/library portal integration.
- ORCID/DOI enrichment.
- Export to BibTeX, RIS, and citation managers.

\newpage

# CHAPTER 10: CONCLUSION

The National Research Paper Search Engine (NRPSE) was developed to solve a practical and recurring academic challenge: efficient discovery of relevant scholarly papers from a growing corpus. The system successfully combines modern frontend usability with robust backend retrieval and secure administrative governance.

From an engineering perspective, the project demonstrates that a well-designed metadata search platform can provide substantial value when it integrates full-text indexing, faceted filtering, controlled content management, and data integrity safeguards. The architecture achieves a balance between simplicity and scalability by leveraging React for interaction-rich UX and Supabase/PostgreSQL for secure, policy-driven data services.

Key achievements include:
1. End-to-end implementation from data ingestion to discovery.
2. Relevance-oriented search with field-targeted behavior.
3. Admin-protected CSV ingestion and record lifecycle control.
4. Deterministic de-duplication with generated hash uniqueness.
5. Usable and responsive interface suitable for student/research workflows.

The project outcomes indicate that NRPSE can serve as a foundational institutional research discovery system and can be progressively upgraded with semantic intelligence, citation analytics, and collaborative knowledge features. In conclusion, the work fulfills its stated objectives and provides a practical, extensible contribution to academic information retrieval infrastructure.

\newpage

# REFERENCES

1. Manning, C. D., Raghavan, P., & Schütze, H. *Introduction to Information Retrieval*. Cambridge University Press.
2. Witten, I. H., Moffat, A., & Bell, T. C. *Managing Gigabytes: Compressing and Indexing Documents and Images*.
3. Baeza-Yates, R., & Ribeiro-Neto, B. *Modern Information Retrieval*.
4. PostgreSQL Global Development Group. PostgreSQL Documentation (Full-Text Search, Indexing, SQL Functions).
5. Supabase Documentation. Authentication, Database, RLS Policies, Edge Functions.
6. React Documentation. Component architecture and hooks.
7. TypeScript Documentation. Static typing for JavaScript applications.
8. Vite Documentation. Build tool and dev server architecture.
9. TanStack Query Documentation. Data fetching and caching best practices.
10. Tailwind CSS Documentation. Utility-first styling system.
11. Recharts Documentation. Declarative charting library for React.
12. arXiv API User Manual. Metadata feed query standards.
13. Hearst, M. A. *Search User Interfaces*. Cambridge University Press.
14. Kleppmann, M. *Designing Data-Intensive Applications*. O’Reilly.
15. OWASP Foundation. Web Application Security principles.
16. ISO/IEC 25010: Systems and software quality models.
17. IEEE guidelines on software project documentation.
18. ACM Digital Library search architecture papers.
19. Literature on role-based access control in web systems.
20. Studies on faceted search usability in academic retrieval.
21. Documentation on PostgreSQL `tsvector` and `ts_rank` ranking.
22. Documentation on database indexing strategies (GIN/B-tree).
23. Best practices for CSV data quality and ingestion pipelines.
24. Research on duplicate detection in bibliographic metadata.
25. Comparative studies in scholarly search and discovery systems.

\newpage

# ANNEXURES

## ANNEXURE A: PROJECT SNAPSHOT SUMMARY
- Project Name: National Research Paper Search Engine (NRPSE)
- Type: Full-Stack Web Application
- Domain: Academic Information Retrieval
- Core Stack: React + Supabase + PostgreSQL
- Security Model: Authentication + Role-Based Access + RLS

## ANNEXURE B: SAMPLE API CONTRACTS (ABRIDGED)

### B.1 Search Request Parameters
- `query`
- `field` (`all|title|authors|abstract`)
- `year_from`, `year_to`
- `source`, `domain`
- `sort`
- `page`, `per_page`

### B.2 Search Response Envelope
- `success`
- `total`
- `page`
- `per_page`
- `total_pages`
- `results[]`

### B.3 Stats Response Envelope
- `success`
- `total_papers`
- `by_source[]`
- `by_domain[]`
- `year_range`

## ANNEXURE C: SAMPLE TEST SCENARIOS

| Test ID | Scenario | Input | Expected Output |
|---|---|---|---|
| T01 | Basic keyword search | query="machine learning" | Non-empty ranked list |
| T02 | Field-specific search | field="title" | Results primarily matching title |
| T03 | Year filter | year_from=2020 | All records year >= 2020 |
| T04 | Source filter | source="arXiv" | Results only from arXiv |
| T05 | Domain filter | domain="computerscience" | Domain-matching results |
| T06 | Empty query with filters | query="" + source/domain | Filtered records |
| T07 | Unauthorized admin access | non-admin login | Access denied/redirect |
| T08 | Duplicate CSV rows | repeated records | duplicates skipped |
| T09 | Invalid CSV file type | .txt upload | validation error |
| T10 | Bulk delete confirmation | selected IDs | specified records removed |

## ANNEXURE D: TEXTUAL ER MODEL

### Entities
1. Papers
2. User Roles
3. Profiles

### Relationships
- One user can have multiple roles.
- One user has one profile.
- Papers are content records managed by admins.

### Integrity Constraints
- Unique dedupe hash for papers.
- Role enum restrictions.
- Foreign key from role/profile tables to auth users.

## ANNEXURE E: DFD NOTES FOR REPORT DRAWING

Use this section to convert text DFD into diagrams in draw.io/Visio:
1. Draw external entities: User, Admin, Database.
2. Draw processes: Search Processing, Auth Check, Upload Pipeline, Delete Pipeline, Stats Service.
3. Add data stores: Papers Table, Roles Table, Profiles Table.
4. Connect flows with arrows and labels.

## ANNEXURE F: SAMPLE CSV TEMPLATE

```csv
title,authors,abstract,year,source,domain,url
Example Paper A,Author One; Author Two,This paper studies...,2024,arXiv,ComputerScience,https://arxiv.org/abs/xxxx.xxxxx
Example Paper B,Author Three,This paper proposes...,2023,arXiv,Physics,https://arxiv.org/abs/yyyy.yyyyy
```

## ANNEXURE G: DEPLOYMENT CHECKLIST
1. Configure frontend environment variables.
2. Apply SQL schema and policies in Supabase.
3. Create admin role assignment in `user_roles`.
4. Deploy edge functions if used.
5. Build frontend and deploy hosting target.
6. Run sanity checks for search, login, upload, delete.

## ANNEXURE H: PAGE EXPANSION GUIDANCE FOR FINAL UNIVERSITY SUBMISSION
To ensure printed report comfortably crosses 50 pages:
1. Insert architecture diagram (1 page).
2. Insert ER diagram (1 page).
3. Insert DFD Level 0 and Level 1 diagrams (2 pages).
4. Add UI screenshots (Home, Search, Filters, Results, Admin Login, Admin Dashboard, Upload Progress, Delete Dialog) (8–12 pages).
5. Add SQL schema screenshots and query execution captures (5–8 pages).
6. Add test evidence table with screenshots (8–10 pages).
7. Include code snippets (selected, formatted) for critical modules (6–8 pages).
8. Keep line spacing 1.5 and 12pt font with margins per university norms.

With these annexure inserts and the chapter content above, the final compiled DOC/PDF typically exceeds the 50-page requirement for MCA/Engineering project reports.

\newpage

# EXTENDED CONTENT FOR 50+ PAGE SUBMISSION

## EXT-1: DETAILED INTRODUCTION NARRATIVE

The modern research ecosystem is increasingly data-intensive, interdisciplinary, and time-constrained. Students working on dissertations, faculty preparing review papers, and professionals transitioning into research-oriented domains all rely on fast and reliable access to scholarly literature. However, literature retrieval remains one of the most underestimated bottlenecks in academic productivity. The quality of a research outcome is heavily dependent on the quality and completeness of the reviewed literature. If relevant prior work is missed, the novelty claim weakens; if outdated or low-relevance sources dominate the references, the methodological direction suffers.

In many institutions, especially where centralized digital library infrastructure is still evolving, users often switch between multiple platforms for discovering papers. They may collect links in spreadsheets, browser bookmarks, and personal notes. This workflow is not only inefficient but also difficult to audit and reproduce. Reproducibility in literature review is important for thesis supervision, peer collaboration, and project continuity. Hence, a system that centralizes and standardizes retrieval workflows offers both immediate utility and long-term academic value.

NRPSE is developed in this exact context. It is intentionally designed as a practical system rather than a purely conceptual prototype. The project emphasizes measurable utility: faster filtering, cleaner metadata, robust query behavior, and reliable admin control. By integrating these capabilities into one platform, NRPSE reduces fragmentation in the discovery process and provides a reusable foundation for institutional scholarly search solutions.

From a pedagogical perspective, this project also demonstrates full-stack engineering integration: interface design, data modeling, search algorithms, access control, and operational tooling. Therefore, NRPSE is both a functional product and an academic engineering case study.

## EXT-2: DETAILED PROBLEM CONTEXT AND JUSTIFICATION

The problem targeted in this work can be formally framed as follows: **Given a large and continuously growing corpus of research metadata, design an efficient retrieval system that maximizes relevance and usability while preserving data integrity and access governance.**

### 2.1 Practical Challenges Observed
1. Users frequently issue broad keyword queries and get noisy result sets.
2. Manual filtering for year/domain/source is tedious in disconnected systems.
3. Multiple duplicate records appear when metadata from several imports overlap.
4. Admins have no controlled pipelines for bulk upload and cleanup in many simple repositories.
5. Users are rarely informed about repository composition (which domain/source is dominant).

### 2.2 Consequences of Existing Challenges
- Increased time-to-first-relevant-paper.
- Incomplete or biased literature review.
- Duplicate references in project reports.
- Reduced trust in institutional repositories.
- Difficulty in scaling the repository over semesters/academic sessions.

### 2.3 Why NRPSE is Necessary
NRPSE answers an institutional need where autonomy and control matter. Instead of relying entirely on external search portals, departments can curate and maintain focused collections while still delivering modern search capabilities to users. The system supports both exploratory search and targeted retrieval, which are two different but equally important search intents in research practice.

## EXT-3: EXPANDED LITERATURE SYNTHESIS

Academic retrieval systems typically evolve across three methodological generations:

1. **Keyword Match Era** – exact token matching with minimal ranking intelligence.
2. **Statistical Ranking Era** – term frequency and relevance scoring improvements.
3. **Semantic and Hybrid Era** – embedding-based search + lexical fallback.

NRPSE presently belongs to an advanced lexical retrieval phase with structured filters and weighted field indexing. This is an excellent midpoint for institutional use where explainability, maintainability, and low operational overhead are priorities.

### 3.1 Key Design Learnings from Literature
- Faceted navigation substantially improves user control and confidence.
- Metadata quality is as important as ranking algorithm quality.
- Governance features (roles, policies) are non-optional in institutional tools.
- Fast retrieval alone does not guarantee usability; interface clarity matters.
- Duplicate suppression is critical in bibliographic systems.

### 3.2 Positioning of NRPSE in Existing Landscape
NRPSE is not intended to replicate large global citation databases. Instead, it provides a focused and customizable retrieval environment where institutions can control ingestion, relevance behavior, and user experience. This pragmatic positioning is one of the main strengths of the project.

## EXT-4: DETAILED SYSTEM ARCHITECTURE WALKTHROUGH

### 4.1 Client Layer
The client is built as a single-page React application, allowing dynamic updates without full page reloads. Query state is synchronized with URL parameters, enabling bookmarkable and shareable search states. This directly supports collaborative workflows where a faculty guide can share a query URL with students.

### 4.2 Data Fetching Layer
React Query is used to handle asynchronous data fetching and caching. This design reduces redundant network calls, improves perceived responsiveness, and provides robust loading/error states. Query keys are parameterized using active search filters so cached responses remain coherent.

### 4.3 Search Execution Layer
The search is executed in PostgreSQL through an RPC function. This keeps heavy filtering/sorting logic in the database where indexes and query planner optimizations can be leveraged. Returning a JSON envelope from SQL also simplifies frontend consumption.

### 4.4 Security Layer
The security model combines authentication, role checks, and RLS. Even if frontend restrictions are bypassed, database policies still protect write operations. This defense-in-depth strategy is suitable for academic deployments where accidental misuse is more common than adversarial attacks, but policy protection is still essential.

### 4.5 Administration Layer
The dashboard is designed as an operational control center for repository lifecycle tasks:
- add papers via CSV,
- inspect records,
- bulk-select and delete,
- observe data statistics.

This operational focus is significant because many academic tools stop at search and do not support maintainability workflows.

## EXT-5: DETAILED MODULE-BY-MODULE DESCRIPTION

### 5.1 Home and Discovery Module
The landing page provides repository identity and high-level insight. Statistics cards and chart sections give instant visibility into collection composition. This lowers cognitive load by helping users understand what kind of data is present before they search.

### 5.2 Search and Retrieval Module
This module supports exploratory and precision search modes:
- Exploratory mode: broad keywords + relevance sorting.
- Precision mode: field-constrained query + filters + chronological sort.

Toggle-based advanced filters preserve UI cleanliness while keeping power features available. Result cards present concise metadata, making rapid scan-and-select behavior possible.

### 5.3 Pagination Module
Pagination reduces response payload size and improves runtime behavior with large corpora. It also structures reading behavior by chunking result review into manageable pages.

### 5.4 Admin Authentication Module
Session retrieval and role validation logic ensures that only authorized users enter the dashboard. Non-admin users are denied access even after successful credential login.

### 5.5 Upload and Ingestion Module
CSV parser handles quote-aware tokenization. Import workflow performs fallback assignment, field normalization, duplicate suppression, and batched upsert. Progress indicators provide transparency during long operations.

### 5.6 Deletion and Cleanup Module
Deletion workflows support selected IDs and broader modes. Confirmation dialogs reduce accidental data loss. Batch chunking is used for large delete sets.

### 5.7 Analytics Module
Aggregated statistics by source and domain are visualized as bar charts. Minimum category thresholds improve readability by reducing long-tail noise.

## EXT-6: DETAILED DATA MODEL DISCUSSION

The `papers` table acts as a denormalized but highly practical retrieval model. For search workloads, this is beneficial because it minimizes join complexity and keeps filtering straightforward. The generated `fts` vector and `dedupe_hash` column represent two important design patterns:

1. **Search acceleration pattern** using generated text vector + GIN index.
2. **Data quality pattern** using generated fingerprint + unique index.

### 6.1 Why Hash-Based Dedupe Works Here
Paper metadata often has no universal guaranteed primary key across all imported sources. DOI may be absent, URL may vary, and titles may have minor formatting differences. By normalizing selected fields and hashing their concatenation, the system creates a practical surrogate uniqueness criterion. This approach is deterministic and operationally simple.

### 6.2 Risks and Mitigations
- Risk: false negatives when semantically same paper has materially different metadata strings.
  - Mitigation: future fuzzy dedupe enhancement.
- Risk: false positives for very similar records.
  - Mitigation: include enough discriminative fields (title/authors/year/source/domain/url).

## EXT-7: ALGORITHMIC ANALYSIS (DETAILED)

### 7.1 Query Processing Stages
1. Parse request parameters.
2. Apply defensive bounds to page and page size.
3. Build conditional WHERE predicates.
4. Execute count query.
5. Execute data query with scoring and sort expression.
6. Wrap in JSON response.

### 7.2 Complexity Considerations
For indexed retrieval, effective performance depends on selective filters and FTS index utilization. With pagination and bounded page size, response payload remains controlled even if total corpus grows significantly.

### 7.3 Ranking Design Rationale
The ranking strategy balances practical interpretability and utility:
- `ts_rank` used for full-text mode.
- deterministic lexical fallback for field-specific matching.

Users can override relevance with explicit chronological sorting, which is important for quickly finding recent literature.

### 7.4 Upload Algorithm Resilience
Adaptive batching is critical for real-world ingestion because a single static batch size is often unreliable under changing server/network conditions. The algorithm’s reduce-on-timeout and retry-with-backoff pattern increases success probability without manual tuning per upload.

## EXT-8: DETAILED IMPLEMENTATION NOTES

### 8.1 Frontend Engineering Practices
- Typed interfaces prevent shape mismatch bugs.
- Component decomposition keeps UI maintainable.
- Route-level separation isolates public and admin concerns.
- Toast notifications provide instant feedback for failures/success.

### 8.2 Backend Engineering Practices
- Core search logic centralized in SQL function.
- Policy-based security at data layer.
- Generated columns reduce application-side recomputation.
- Edge functions isolate privileged workflows.

### 8.3 Reliability and UX Interplay
Users trust systems that communicate progress and failure clearly. Upload/delete progress indicators and explicit error messages significantly improve perceived reliability. In research workflows, this is valuable because users often process large datasets and need confidence in operation outcomes.

## EXT-9: DETAILED PERFORMANCE DISCUSSION

### 9.1 Retrieval Responsiveness
Observed system behavior indicates responsive query cycles for standard page sizes and indexed corpora. The design avoids sending full datasets to clients and instead performs all heavy operations server-side.

### 9.2 Quality of Result Sets
When users apply source/domain/year filters, irrelevant records reduce substantially. Field-specific search allows users to target intent (e.g., find papers by author vs. topic).

### 9.3 Admin Throughput
Batch import and dedupe logic allow practical ingestion of sizable CSV files. Adaptive batching reduces operational interruptions during peak load.

### 9.4 Comparison With Non-Indexed Baseline
In non-indexed metadata tables, keyword search degrades quickly with growth. In NRPSE, FTS index usage and bounded result pages provide significantly better scalability behavior.

## EXT-10: SECURITY THREAT MODEL (ACADEMIC CONTEXT)

### 10.1 Threat Categories
1. Unauthorized write attempts.
2. Session misuse.
3. Malformed upload payloads.
4. Excessive delete actions.

### 10.2 Applied Controls
- Role-check gate before admin actions.
- RLS as final enforcement boundary.
- Input validation and fallback normalization.
- Confirmation dialogs for destructive operations.

### 10.3 Residual Risks
- Credential sharing among admins.
- Lack of detailed immutable audit trails in current version.
- Need for stronger anomaly detection for high-risk operations.

### 10.4 Recommended Security Enhancements
- MFA for admin accounts.
- Signed audit logs.
- Operation rate limits.
- Fine-grained operation scopes (separate uploader/deleter roles).

## EXT-11: SCALABILITY ROADMAP IN PHASES

### Phase I (Current)
Metadata search, filters, role control, dedupe, charts.

### Phase II
Materialized analytical views, smarter caching, upload queueing.

### Phase III
Hybrid lexical + semantic search, recommendation layer, citation graph.

### Phase IV
Multi-tenant institutional deployment with tenant-isolated policies and custom taxonomies.

## EXT-12: USER EXPERIENCE EVALUATION (QUALITATIVE)

### 12.1 Student Perspective
Students benefit from quick filter-based narrowing and clear result cards. The ability to iterate query parameters rapidly makes topic familiarization faster.

### 12.2 Faculty Perspective
Faculty can use filtered searches to curate reading material by domain and recency. Admin controls support maintaining curated corpora for specific courses or labs.

### 12.3 Admin Perspective
Operational tooling in dashboard reduces dependency on direct SQL actions. This lowers maintenance complexity and potential operator errors.

## EXT-13: ETHICAL AND ACADEMIC CONSIDERATIONS

NRPSE stores metadata and URLs, not unauthorized full-text copies. This design respects source ownership and publication access rules. The system should be used to facilitate discovery, not to bypass publisher restrictions. Proper citation and attribution remain mandatory in all academic outputs derived from discovered papers.

The platform can also reduce literature review bias by encouraging broader query exploration through structured filters and domain views. However, users must still critically evaluate paper quality, venue credibility, and methodological rigor.

## EXT-14: PROJECT MANAGEMENT SUMMARY

### 14.1 Development Stages
1. Requirement analysis and UI flow planning.
2. Database schema and function setup.
3. Public search module implementation.
4. Admin auth and dashboard implementation.
5. CSV pipeline and dedupe hardening.
6. Testing, migration alignment, and report preparation.

### 14.2 Risk Handling During Development
- Timeout risk addressed through adaptive batching.
- Duplicate data risk addressed through generated hash uniqueness.
- Unauthorized write risk addressed through role policies.

### 14.3 Maintainability Outcomes
Typed APIs, modular components, and centralized RPC logic improve long-term maintainability and onboarding for future contributors.

## EXT-15: DETAILED CHAPTER-WISE PAGE PLANNING TEMPLATE

Use the following suggested pagination while converting this markdown to Word/PDF:

| Section | Suggested Pages |
|---|---:|
| Title + Certificate + Declaration + Acknowledgement | 4 |
| Abstract + TOC + Abbreviations | 4 |
| Chapter 1 | 5 |
| Chapter 2 | 5 |
| Chapter 3 | 6 |
| Chapter 4 | 6 |
| Chapter 5 | 7 |
| Chapter 6 | 5 |
| Chapter 7 | 4 |
| Chapter 8 + Chapter 9 + Chapter 10 | 4 |
| References | 2 |
| Annexures + Screenshots + Test Evidence | 10+ |

**Total:** 62+ pages (typical format: A4, 12pt, 1.5 line spacing, justified text, chapter page breaks)

## EXT-16: READY-TO-FILL TABLES FOR FINAL SUBMISSION

### 16.1 Hardware/Software Requirement Table

| Category | Specification |
|---|---|
| Processor | ____________________ |
| RAM | ____________________ |
| Storage | ____________________ |
| OS | ____________________ |
| Browser | ____________________ |
| Node Version | ____________________ |
| Database | Supabase PostgreSQL |

### 16.2 Team Responsibility Table

| Team Member | Responsibility | Duration |
|---|---|---|
| ____________________ | Frontend development | __________ |
| ____________________ | Backend and DB | __________ |
| ____________________ | Testing and documentation | __________ |

### 16.3 Test Execution Log Template

| Date | Module | Test Type | Status | Remarks |
|---|---|---|---|---|
| __________ | Search | Functional | Pass/Fail | __________ |
| __________ | Admin Login | Security | Pass/Fail | __________ |
| __________ | CSV Upload | Integration | Pass/Fail | __________ |
| __________ | Delete Workflow | Functional | Pass/Fail | __________ |

## EXT-17: SAMPLE VIVA QUESTIONS AND ANSWERS

1. **Why did you choose PostgreSQL full-text search?**  
	Because it provides robust lexical search, weighting, and indexing with low operational overhead.

2. **How is duplicate data prevented?**  
	A generated hash fingerprint (`dedupe_hash`) with a unique index prevents duplicate inserts.

3. **How is admin security enforced?**  
	Through authentication, role verification in `user_roles`, and row-level security policies.

4. **How can this project scale in production?**  
	By indexed queries, pagination, adaptive batching, and future partitioning/caching strategies.

5. **What is the most important future enhancement?**  
	Hybrid semantic + lexical search for better concept-level retrieval.

## EXT-18: FINAL SUBMISSION INSTRUCTIONS

1. Replace all placeholder fields (name, roll no, degree, guide).
2. Insert institution logo on title page if required.
3. Convert DFD/ER textual notes into formal diagrams.
4. Add screenshots for each major module.
5. Add page numbers and list of figures/tables if your university asks.
6. Export as PDF and verify margins/spacing according to department norms.


## EXT-19: CHAPTER-WISE EXTENDED DISCUSSION FOR LONG-FORM SUBMISSION

### 19.1 Extended Discussion for Chapter 1 (Introduction)
Research is fundamentally cumulative. Every new experiment, model, policy study, or engineering design builds on existing evidence. Therefore, literature discovery is not a peripheral activity; it is a central research operation. When students begin a project, one of the first challenges is understanding what has already been done, what remains unresolved, and where meaningful contribution is possible. In practice, this discovery process can take weeks due to fragmented tool usage.

In many academic settings, students use ad hoc methods such as random keyword searches, peer recommendations, and citation trails from a handful of papers. While useful, this approach can produce narrow coverage and hidden selection bias. A structured retrieval system helps by exposing broader evidence space through filters and ranked results. NRPSE contributes by transforming search from a random process into a guided and repeatable workflow.

Another important point is institutional continuity. Student batches change every year. Without a maintained repository, knowledge is repeatedly re-collected rather than reused. A searchable and curated metadata platform can serve as an evolving institutional memory where future students can quickly identify historical directions, topic density, and source quality trends.

### 19.2 Extended Discussion for Chapter 2 (Literature Review)
The scholarly search ecosystem includes multiple types of systems, each optimized for specific goals. Large-scale global indexes optimize coverage and broad discoverability. Institutional repositories optimize local archival and compliance needs. Domain-specialized platforms optimize disciplinary precision. However, very few systems optimize simultaneously for local governance, modern UX, and operational ingestion workflows. NRPSE intentionally addresses this “middle ground.”

Faceted search research indicates that users benefit when results can be narrowed incrementally rather than by rewriting long queries repeatedly. This aligns with cognitive models of exploratory search where users refine intent during interaction. NRPSE operationalizes this through filter controls and URL-persisted parameters, making iterative exploration practical.

Further, literature on information quality emphasizes that retrieval performance depends not only on ranking algorithms but also on metadata hygiene. Duplicate and inconsistent records reduce trust in search output. By integrating dedupe as part of schema design and ingestion pipeline, NRPSE applies this lesson directly.

### 19.3 Extended Discussion for Chapter 3 (Proposed System)
The architecture adopts an integration-first mindset. Instead of creating separate disconnected scripts and interfaces for ingestion, search, and statistics, all major workflows are unified under one stack. This reduces handoff friction between users and administrators.

An additional design choice is to keep core retrieval logic in SQL functions rather than in frontend code. This improves consistency because all clients calling the function receive the same behavior. It also eases future governance: if ranking logic needs refinement, it can be updated centrally.

For report presentation, the architecture can be represented as a four-tier model:
1. Interaction tier (user interface and routes),
2. Orchestration tier (typed API layer + query client),
3. Retrieval tier (RPC and indexed queries),
4. Governance tier (auth, roles, RLS, admin operations).

This structured layering helps evaluators understand why the system remains maintainable despite supporting both public and privileged operations.

### 19.4 Extended Discussion for Chapter 4 (Methodology)
Methodology combines software engineering practice with data pipeline discipline. Data acquisition from arXiv-like feeds is done in batches to avoid API abuse and improve reliability. Data then moves through validation and normalization stages before insertion. This is important because real-world metadata is noisy.

A key methodological strength is the explicit handling of uncertainty. Missing year values, absent author lists, inconsistent domain labels, and malformed rows are common in public datasets. The ingestion logic uses safe defaults and conversion guards, preventing pipeline collapse due to outlier records.

From an experimentation perspective, this project values practical evaluation over purely synthetic benchmarks. Functional correctness, user flow reliability, and admin operation stability were treated as first-class outcomes. This aligns with the objective of building a deployable academic tool rather than only a theoretical retrieval model.

### 19.5 Extended Discussion for Chapter 5 (Implementation)
Implementation details show tight coupling between typed frontend contracts and backend JSON responses. This avoids silent runtime mismatches and improves developer productivity. The use of React Query also simplifies asynchronous state transitions, which is crucial for loading-heavy pages like search and dashboard.

On the backend, SQL function design reduces application-side complexity and keeps data-intensive operations near storage. The unique hash constraint provides a hard guarantee against duplicate insertion at persistence level. Even if frontend logic fails to detect duplicates, database constraints protect corpus integrity.

Admin operations include practical safeguards such as confirmations and progress updates. These features are not merely cosmetic; they are operational controls that reduce accidental destructive actions and increase trust in long-running workflows.

### 19.6 Extended Discussion for Chapter 6 (Results)
Result quality in academic search is multidimensional. A system can be fast but irrelevant, or relevant but difficult to use. NRPSE aims for balanced performance. Observed behavior indicates that relevance sorting combined with field control produces meaningful top results for many query types.

Filtering by domain and year has strong practical value during review writing. For example, students drafting a “recent trends” section can restrict by year range and sort newest first. Researchers exploring foundational works can sort by oldest and scan historical development quickly.

Admin-side results are equally important. Stable import and dedupe behavior directly affect user-side trust. When users repeatedly see clean and non-duplicated results, adoption improves and the repository becomes part of routine research workflow.

### 19.7 Extended Discussion for Chapter 7 (Security and Scalability)
Security in institutional tools must assume mixed trust conditions: most users are legitimate but mistakes and policy violations can still occur. A layered security model is therefore appropriate. NRPSE uses session checks, role checks, and data-layer policy checks so that no single bypass grants full control.

Scalability strategy is incremental. The current architecture supports moderate growth through indexing and pagination. Future growth can be addressed through partitioning, cache layers, and asynchronous ingestion queues. This phased scalability model is practical for academic institutions where adoption may ramp gradually.

### 19.8 Extended Discussion for Chapter 8 (Limitations)
Limitations are not shortcomings alone; they are design boundaries that preserve system simplicity in MVP-to-production transitions. Choosing metadata-first retrieval reduced complexity and enabled stable delivery. However, semantic retrieval and citation intelligence remain key future upgrades.

Another limitation is evaluation infrastructure. Formal IR benchmark pipelines with large relevance-labeled corpora would strengthen empirical claims. This can be addressed in future academic extensions of the project.

### 19.9 Extended Discussion for Chapter 9 (Future Scope)
Future scope should prioritize high-benefit enhancements that preserve explainability. A hybrid lexical-semantic retrieval strategy is a strong next step because it improves concept-level recall while retaining deterministic filter behavior.

Institutional integration opportunities are also significant: LMS embedding, citation exports, and department-specific curated collections can transform NRPSE from a standalone tool into a core academic service.

### 19.10 Extended Discussion for Chapter 10 (Conclusion)
The project demonstrates that carefully selected technologies and disciplined schema design can produce a robust academic retrieval platform without excessive complexity. NRPSE’s contribution lies in practical completeness: search, filter, governance, quality control, and reporting readiness. This makes it suitable both as an engineering submission and as a deployable institutional prototype.

## EXT-20: EXTENDED QUALITY ASSURANCE DOCUMENTATION

### 20.1 Functional Test Matrix (Detailed)

| Module | Sub-Feature | Positive Cases | Negative Cases | Expected Stability |
|---|---|---|---|---|
| Search | Keyword query | known terms | gibberish term | Stable |
| Search | Field mode | title/authors/abstract | unsupported value | Stable |
| Filters | Year range | valid bounds | year_from > year_to | graceful handling |
| Filters | Source/domain | known categories | missing categories | fallback to all |
| Sort | Relevance/year/title | all modes | invalid mode | default ordering |
| Pagination | Next/prev | within range | beyond bounds | clamped behavior |
| Admin Auth | Login | valid credentials | invalid credentials | secure rejection |
| Role Check | Dashboard access | admin user | non-admin user | redirect/deny |
| Upload | CSV parse | valid schema | malformed rows | partial robust handling |
| Dedupe | Hash uniqueness | repeated records | near duplicates | unique enforcement |
| Delete | Selected rows | valid ids | empty selection | warning/no-op |

### 20.2 Non-Functional Quality Notes
1. **Usability:** clean workflow with low-click search refinement.
2. **Reliability:** retries for transient upload failures.
3. **Performance:** indexed query execution with paginated payload.
4. **Security:** policy-enforced write protection.
5. **Maintainability:** modular components and typed interfaces.

### 20.3 Suggested Acceptance Criteria for Institutional Rollout
- 95%+ successful execution of standard test matrix.
- Zero unauthorized write access in role-policy tests.
- Stable import for designated CSV size envelope.
- No duplicate insertion for repeated import attempts.

## EXT-21: EXTENDED ANNEXURE – SAMPLE CONTENT FOR ADDITIONAL PAGES

### 21.1 Sample Use Case Narratives

#### Use Case A: Student Performing Literature Review
Actor: Student  
Goal: Find high-relevance papers on selected topic and year range  
Flow: Open search page → enter query → set domain/year filters → sort by relevance → open result links.

#### Use Case B: Faculty Curating Reading List
Actor: Faculty  
Goal: Identify top papers from trusted source and newest year  
Flow: Apply source filter → sort by newest year → inspect abstracts → shortlist links.

#### Use Case C: Admin Updating Repository
Actor: Admin  
Goal: Import new semester dataset and remove obsolete duplicates  
Flow: Login → upload CSV → monitor progress → validate stats → delete obsolete records.

### 21.2 Sequence Narrative for Search Operation
1. User enters query in search bar.
2. Frontend updates local parameter state.
3. User triggers search.
4. State serialized into URL query parameters.
5. React Query invokes search RPC.
6. Database computes count and ranked rows.
7. JSON payload returned.
8. Frontend renders cards + pagination.

### 21.3 Sequence Narrative for Upload Operation
1. Admin selects one or more CSV files.
2. Client validates extension and parses headers.
3. Rows normalized and fingerprinted.
4. Duplicate rows in file removed.
5. Batched upsert begins.
6. On timeout, batch size reduced and retried.
7. Completion status shown with summary.

### 21.4 Extended Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Invalid CSV schema | Medium | Medium | Header checks + defaults |
| Timeout during import | Medium | High | Adaptive batching + retries |
| Unauthorized dashboard access | Low | High | Role check + RLS |
| Duplicate data growth | High | Medium | dedupe hash unique index |
| User confusion in filters | Medium | Medium | clear labels + defaults |
| Data inconsistency by source | Medium | Medium | normalization pipeline |

### 21.5 Maintenance Checklist (Monthly)
1. Review top sources/domains for taxonomy drift.
2. Validate role assignments in admin table.
3. Check failed import logs and retry if needed.
4. Audit unusual delete activity.
5. Verify backup and restore readiness.

## EXT-22: LONG-FORM ACADEMIC WRITING BLOCKS (READY TO PASTE IN WORD)

### 22.1 Research Contribution Statement
This work contributes a practical architecture for institution-oriented scholarly retrieval where discoverability and governance are equally prioritized. The project demonstrates that robust search quality can be achieved without abandoning operational simplicity. By combining weighted full-text indexing, faceted filtering, deterministic deduplication, and policy-based admin controls, the system provides a reproducible template for academic repositories operating under constrained resources.

### 22.2 Societal and Educational Relevance
In many developing educational ecosystems, access to organized and navigable research collections remains uneven. A system like NRPSE can reduce entry barriers for first-generation researchers and improve the efficiency of project-based learning. Better literature access often leads to better problem formulation, stronger methodology choices, and improved originality in student projects.

### 22.3 Sustainability of the Platform
Sustainability in academic software is determined less by flashy features and more by operational maintainability. NRPSE’s design choices—typed interfaces, schema-level constraints, and clear separation of privileged actions—favor long-term sustainability. New contributors can onboard faster because core behavior is centralized in well-defined modules.

## EXT-23: FINAL PAGE-LENGTH ASSURANCE NOTE

When formatted in standard university report style (A4, Times New Roman 12, 1.5 line spacing, justified text, chapter page breaks, tables/figures/screenshot evidence), this document plus annexures is suitable for **50+ pages**. 

For guaranteed compliance, include:
1. Minimum 10–12 UI screenshots with captions.
2. DFD Level 0, Level 1, and ER diagram figures.
3. SQL function snippets and policy screenshots.
4. Test execution evidence pages.
5. Signed certificate/declaration pages as hard inserts.

These additions are standard in MCA/Engineering submissions and push the final compiled report well beyond the minimum threshold.


# END OF REPORT
