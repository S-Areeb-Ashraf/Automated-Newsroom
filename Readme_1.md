# Pandas Cheat Sheet (Competition Ready)

> **Code-only reference for Data/Analytics competitions**

---

## Imports

```python
import pandas as pd
import numpy as np
```

---

## Sample Dataset (used below)

```python
# Small, consistent dataset used across examples
data = {
	"id": [1, 2, 3, 4, 5, 6, 7, 8],
	"team": ["A", "A", "B", "B", "C", "C", "C", "A"],
	"round": [1, 1, 1, 2, 1, 2, 3, 2],
	"score": [10, 15, 7, 20, 5, 12, np.nan, 18],
	"date": pd.to_datetime([
		"2025-01-01","2025-01-02","2025-01-03","2025-01-04",
		"2025-01-05","2025-01-06","2025-01-07","2025-01-08"
	]),
	"note": ["alpha","beta","gamma","delta","epsilon",None,"zeta","eta"],
}
df = pd.DataFrame(data)

# Extra small frames for merge/concat examples
df1 = df[["id","team"]]
df2 = pd.DataFrame({"id":[1,2,3,9], "country":["IN","US","UK","DE"]})
df_a = df.iloc[:4]
df_b = df.iloc[4:]
```

---

## Reading Data

```python
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")
df = pd.read_json("data.json")
df = pd.read_parquet("data.parquet")
```

---

### Examples

```python
from io import StringIO  # in-memory text buffer for quick demos
csv_text = "id,team,score\n1,A,10\n2,A,15"  # minimal CSV
df_read = pd.read_csv(StringIO(csv_text))  # read CSV text into DataFrame
df_json = pd.read_json(StringIO('[{"id":1,"team":"A","score":10}]'))  # read JSON
```

---

## Writing Data

```python
df.to_csv("out.csv", index=False)
df.to_excel("out.xlsx", index=False)
df.to_json("out.json")
df.to_parquet("out.parquet")
```

---

### Examples

```python
df.to_csv("out.csv", index=False)  # write CSV without index
df.to_excel("out.xlsx", index=False)  # write Excel file
df.to_json("out.json")  # write JSON
```

---

## Basic Inspection

```python
df.head()
df.tail()
# for displayg rows and cols
df.shape
df.columns
df.index
df.dtypes
# Display concise summary of the DataFrame
df.info()
# Get summary statistics for numerical columns
df.describe()
```

---

### Examples

```python
df.head(3)  # first 3 rows
df.tail(2)  # last 2 rows
df.shape  # (rows, columns)
df.columns  # column names
df.index  # row index
df.dtypes  # data types per column
df.info()  # concise summary incl. non-null counts
df.describe()  # summary stats for numeric columns
```

---

## Selection

```python
df["col"]
df[["col1", "col2"]]
df.loc[0]
df.loc[:, ["col1", "col2"]]
df.iloc[0]
df.iloc[:, 0:3]
df.at[0, "col"]
df.iat[0, 0]
```

---

### Examples

```python
df["team"]  # select single column (Series)
df[["team", "score"]]  # select multiple columns (DataFrame)
df.loc[0]  # row by label (index value)
df.loc[:, ["team", "score"]]  # all rows, specific columns
df.iloc[0]  # row by integer position
df.iloc[:, 0:3]  # all rows, first 3 columns
df.at[0, "team"]  # fast scalar access by label
df.iat[0, 0]  # fast scalar access by position
```

---

## Filtering

```python
df[df["col"] > 10]
df[df["col"].isin([1, 2, 3])]
df[df["col"].between(5, 10)]
df[df["col"].notna()]
df.query("col > 10 and col2 == 'A'")
```

---

### Examples

```python
df[df["score"] > 10]  # rows with score > 10
df[df["id"].isin([1, 3, 5])]  # ids in the given set
df[df["score"].between(10, 18)]  # score within range [10, 18]
df[df["note"].notna()]  # non-missing notes
df.query("score > 10 and team == 'A'")  # boolean query string
```

---

## Sorting

```python
df.sort_values("col")
df.sort_values(["col1", "col2"], ascending=[True, False])
df.sort_index()
```

---

### Examples

```python
df.sort_values("score")  # sort by one column ascending
df.sort_values(["team", "score"], ascending=[True, False])  # multi-key sort
df.sort_index()  # sort by row index
```

---

## Missing Values

```python
df.isna()
df.notna()
df.dropna()
df.dropna(axis=1)
df.fillna(0)
df.fillna(method="ffill")
df.fillna(method="bfill")
```

---

### Examples

```python
df.isna()  # boolean mask of missing values
df.dropna(subset=["score"])  # drop rows where score is NaN
df.fillna({"score": 0, "note": ""})  # fill selected columns
df.fillna(method="ffill")  # forward-fill downwards
df.fillna(method="bfill")  # backward-fill upwards
```

---

## Type Conversion

```python
df["col"].astype(int)
df["col"] = pd.to_numeric(df["col"], errors="coerce")
df["date"] = pd.to_datetime(df["date"])
```

---

### Examples

```python
df["score"].fillna(0).astype(int)  # convert to int after filling NaNs
df["score"] = pd.to_numeric(df["score"], errors="coerce")  # force numeric
df["date"] = pd.to_datetime(df["date"])  # ensure datetime dtype
```

---

## Column Operations

```python
df["new"] = df["a"] + df["b"]
df.rename(columns={"old": "new"})
df.drop(columns=["col"])
df.assign(x=df["a"] * 2)
```

---

### Examples

```python
df["double_score"] = df["score"].fillna(0) * 2  # new derived column
df_ren = df.rename(columns={"note": "comment"})  # rename column
df_drop = df.drop(columns=["round"])  # drop an unwanted column
df_assigned = df.assign(score2=lambda x: x["score"].fillna(0) ** 2)  # add via assign
```

---

## Row Operations

```python
df.drop(index=0)
df.sample(frac=0.1)
df.sample(n=5)
df.reset_index(drop=True)
```

---

### Examples

```python
df.drop(index=0)  # remove first row by label
df.sample(frac=0.25, random_state=0)  # sample 25% of rows
df.sample(n=3, random_state=0)  # sample 3 rows
df.reset_index(drop=True)  # reset to RangeIndex and drop old index
```

---

## Apply / Map

```python
df["col"].apply(lambda x: x * 2)
df.apply(np.sum)
df.apply(lambda x: x.max() - x.min())
df["col"].map({1: "A", 2: "B"})
```

---

### Examples

```python
df["score"].apply(lambda x: (x or 0) * 2)  # element-wise transform
df.apply(np.sum)  # column-wise sum (numeric columns)
df.apply(lambda s: s.max() if s.dtype != "O" else None)  # per-column function
df["id"].map({1: "one", 2: "two"})  # value mapping by dict
```

---

## Replace

```python
df.replace(0, np.nan)
df.replace({"col": {1: 100, 2: 200}})
```

---

### Examples

```python
df_repl0 = df.replace(0, np.nan)  # turn zeros into NaNs
df_team_map = df.replace({"team": {"A": "Alpha", "B": "Beta"}})  # remap labels
```

---

## Value Counts & Uniques

```python
df["col"].value_counts()
df["col"].unique()
df["col"].nunique()
```

---

### Examples

```python
df["team"].value_counts()  # frequency table
df["team"].unique()  # distinct values
df["team"].nunique()  # number of distinct values
```

---

## GroupBy

```python
df.groupby("col").mean()
df.groupby("col")["val"].sum()
df.groupby(["c1", "c2"]).agg(["mean", "sum", "count"])
df.groupby("col").agg(total=("val", "sum"))
```

---

### Examples

```python
df.groupby("team")["score"].mean()  # mean score per team
df.groupby("team")["score"].sum()  # total score per team
df.groupby(["team", "round"]).agg(score_mean=("score", "mean"), score_sum=("score", "sum"), count=("id", "count"))  # multi-agg
df.groupby("team").agg(total_score=("score", "sum"))  # named aggregate
```

---

## Pivot / Reshape

```python
pd.pivot_table(df, values="val", index="col1", columns="col2", aggfunc="mean")
df.pivot(index="col1", columns="col2", values="val")
df.melt(id_vars=["id"], value_vars=["a", "b"])
df.stack()
df.unstack()
```

---

### Examples

```python
pd.pivot_table(df, values="score", index="team", columns="round", aggfunc="mean")  # summary grid
df.pivot(index="team", columns="round", values="score")  # reshape wide by keys
df.melt(id_vars=["id"], value_vars=["team", "score"])  # long format
df.set_index(["team", "round"]).stack()  # stack columns into rows
df.set_index(["team", "round"]).stack().unstack()  # reverse stack
```

---

## Merge / Join

```python
pd.merge(df1, df2, on="id")
pd.merge(df1, df2, how="left", on="id")
pd.merge(df1, df2, left_on="a", right_on="b")
df1.join(df2, on="id")
```

---

### Examples

```python
pd.merge(df1, df2, on="id")  # inner join on shared key
pd.merge(df1, df2, how="left", on="id")  # left join keeps all df1 rows
pd.merge(df1.rename(columns={"id":"a"}), df2.rename(columns={"id":"b"}), left_on="a", right_on="b")  # different key names
df1.set_index("id").join(df2.set_index("id"))  # index-based join
```

---

## Concatenate

```python
pd.concat([df1, df2])
pd.concat([df1, df2], axis=1)
```

---

### Examples

```python
pd.concat([df_a, df_b])  # vertical append (rows)
pd.concat([df_a.reset_index(drop=True), df_b.reset_index(drop=True)], axis=1)  # horizontal (columns)
```

---

## String Operations

```python
df["col"].str.lower()
df["col"].str.upper()
df["col"].str.contains("abc")
df["col"].str.replace("a", "b")
df["col"].str.split(",", expand=True)
df["col"].str.len()
```

---

### Examples

```python
df["note"].str.lower()  # lowercase
df["note"].str.upper()  # uppercase
df["note"].str.contains("a", na=False)  # contains substring
df["note"].str.replace("a", "*")  # replace characters
df["note"].str.split("l", expand=True)  # split into multiple columns
df["note"].str.len()  # string length
```

---

## Datetime Operations

```python
df["date"].dt.year
df["date"].dt.month
df["date"].dt.day
df["date"].dt.weekday
df.set_index("date")
df.resample("M").mean()
```

---

### Examples

```python
df["date"].dt.year  # extract year
df["date"].dt.month  # extract month
df["date"].dt.day  # extract day
df["date"].dt.weekday  # Monday=0
df_dt = df.set_index("date")  # set datetime index
df_dt.resample("M")["score"].mean()  # monthly mean score
```

---

## Math & Statistics

```python
df.sum()
df.mean()
df.median()
df.std()
df.var()
df.min()
df.max()
df.corr()
df.cov()
```

---

### Examples

```python
df["score"].sum()  # total
df["score"].mean()  # average
df["score"].median()  # middle value
df["score"].std()  # standard deviation
df["score"].var()  # variance
df["score"].min()  # minimum
df["score"].max()  # maximum
df[["id","score"]].corr(numeric_only=True)  # correlation
df[["id","score"]].cov()  # covariance
```

---

## Window Functions

```python
df["col"].rolling(3).mean()
df["col"].expanding().sum()
df["col"].shift(1)
df["col"].diff()
```

---

### Examples

```python
df["score"].rolling(3).mean()  # moving average over 3 rows
df["score"].expanding().sum()  # cumulative sum
df["score"].shift(1)  # lag by 1 row
df["score"].diff()  # difference with previous row
```

---

## Duplicates

```python
df.duplicated()
df.drop_duplicates()
df.drop_duplicates(subset=["col"])
```

---

### Examples

```python
df.duplicated()  # mark duplicate rows
df.drop_duplicates()  # remove exact duplicates
df.drop_duplicates(subset=["team"])  # keep first occurrence per team
```

---

## Index Handling

```python
df.set_index("col")
df.reset_index()
df.reindex(new_index)
```

---

### Examples

```python
df_idx = df.set_index("id")  # set id as index
df_reset = df_idx.reset_index()  # restore to column
new_index = [1, 2, 3, 4, 9]  # target index labels
df_reindexed = df_idx.reindex(new_index)  # align to new index
```

---

## Boolean Logic

```python
(df["a"] > 5) & (df["b"] < 10)
(df["a"] > 5) | (df["b"] < 10)
~(df["a"] > 5)
```

---

### Examples

```python
(df["score"] > 10) & (df["team"] == "A")  # AND condition
(df["score"] > 10) | (df["team"] == "C")  # OR condition
~(df["score"] > 10)  # NOT condition
```

---

## Export Filtered Data

```python
df.loc[df["col"] > 10, ["a", "b"]].to_csv("filtered.csv", index=False)
```

---

### Examples

```python
df.loc[df["score"] > 10, ["id", "team"]].to_csv("filtered.csv", index=False)  # export subset
```

---

## Performance Helpers

```python
df.copy()
df.memory_usage(deep=True)
df.astype({"col": "category"})
```

---

### Examples

```python
df_copy = df.copy()  # defensive copy
df.memory_usage(deep=True)  # memory usage including object internals
df_cat = df.astype({"team": "category"})  # compress repeated labels
```

---

## NumPy Interop

```python
pd.DataFrame(np.random.rand(5, 3), columns=["a", "b", "c"])
pd.Series([1, 2, 3])
```

---

### Examples

```python
pd.DataFrame(np.random.rand(3, 2), columns=["x", "y"])  # from NumPy array
pd.Series(np.array([10, 20, 30]))  # Series from NumPy
```

---

## No Headers

```python
df = pd.read_csv("data.csv", header=None)
df.columns = ["a", "b", "c"]
```

---

### Examples

```python
from io import StringIO  # quick CSV demo without headers
csv_no_header = "1,2,3\n4,5,6"  # two rows, three columns
df_noh = pd.read_csv(StringIO(csv_no_header), header=None)  # no header row
df_noh.columns = ["a", "b", "c"]  # assign column names
```

---

## Method Chaining

```python
(df
 .dropna()
 .query("a > 10")
 .assign(c=lambda x: x["a"] * 2)
 .groupby("b")
 .mean()
)
```

---

### Examples

```python
(df
 .dropna(subset=["score"])  # remove missing scores
 .query("score > 10")  # filter to high scores
 .assign(double=lambda x: x["score"] * 2)  # engineer a feature
 .groupby("team")["double"]  # group by team
 .mean()  # average engineered feature
)
```

