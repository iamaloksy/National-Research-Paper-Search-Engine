import feedparser
import pandas as pd
import os
import time
from urllib.parse import quote_plus

# ------------------ Config ------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# All major arXiv fields
QUERIES = {
    "ComputerScience": "cat:cs.*",
    "Physics": "cat:physics.*",
    "Mathematics": "cat:math.*",
    "Statistics": "cat:stat.*",
    "QuantitativeBiology": "cat:q-bio.*",
    "QuantitativeFinance": "cat:q-fin.*",
    "Economics": "cat:econ.*",
    "ElectricalEngineering": "cat:eess.*",
}

TOTAL_RESULTS_PER_QUERY = 10000
BATCH_SIZE = 200
SLEEP_TIME = 1  # seconds between requests

# ------------------ Fetch Loop ------------------
for domain, query in QUERIES.items():
    print(f"\nFetching papers for domain: {domain} | Query: {query}")

    encoded_query = quote_plus(query)
    data = []

    for start in range(0, TOTAL_RESULTS_PER_QUERY, BATCH_SIZE):
        url = (
            f"https://export.arxiv.org/api/query?"
            f"search_query={encoded_query}"
            f"&start={start}&max_results={BATCH_SIZE}"
        )

        feed = feedparser.parse(
            url,
            request_headers={"User-Agent": "ResearchPaperSearch/1.0 (mailto:example@example.com)"}
        )

        if feed.bozo:
            print(f"[-] Skipped batch {start}-{start + BATCH_SIZE}: {feed.bozo_exception}")
            continue

        if not feed.entries:
            print(f"[!] No more results for {domain} at start={start}")
            break

        for e in feed.entries:
            title = getattr(e, "title", "").replace("\n", " ").strip()
            abstract = getattr(e, "summary", "").replace("\n", " ").strip()
            authors = ", ".join(a.name for a in getattr(e, "authors", []))
            published = getattr(e, "published", "")
            year = published[:4] if published else ""

            # arXiv URL
            url_link = ""
            if hasattr(e, "links") and len(e.links) > 0:
                url_link = e.links[0].href

            data.append({
                "year": year,
                "authors": authors,
                "abstract": abstract,
                "title": title,
                "source": "arXiv",
                "domain": domain,
                "url": url_link
            })

        print(f"[+] {domain}: Collected {len(data)} papers so far...")
        time.sleep(SLEEP_TIME)

    # ------------------ Save per-domain CSV ------------------
    df = pd.DataFrame(data)

    file_path = os.path.join(DATA_DIR, f"arxiv_{domain.lower()}_metadata.csv")
    df.to_csv(file_path, index=False, encoding="utf-8")

    print(f"Saved {domain} papers to: {file_path}")
    print(f"Total papers in {domain}: {len(df)}")

print("\n🎉 All domains completed!")
