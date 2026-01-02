# Titanic Dataset – Complex Pandas Examples (Competition Ready)

### This file demonstrates complex pandas operations
# Topics covered:
- Boolean filtering
- groupby + aggregation
- feature engineering
- transform()
- merging
- ranking
- pivot tables

---

```python
import pandas as pd



# Load Titanic dataset
df = pd.read_csv("titanic.csv")


# --------------------------------------------------
# 1. Boolean Filtering with Multiple Conditions
# Female passengers under 30, in 1st class, who survived
filtered_df = df[
    (df["Sex"] == "female") &
    (df["Age"] < 30) &
    (df["Pclass"] == 1) &
    (df["Survived"] == 1)
]

# --------------------------------------------------
# 2. GroupBy with Single Aggregation
# Survival rate by passenger class
survival_by_class = df.groupby("Pclass")["Survived"].mean()

# --------------------------------------------------
# 3. GroupBy with Multiple Aggregations
# Average age, average fare, and passenger count by class
class_summary = df.groupby("Pclass").agg(
    avg_age=("Age", "mean"),
    avg_fare=("Fare", "mean"),
    total_passengers=("PassengerId", "count")
)

# --------------------------------------------------
# 4. GroupBy with Multiple Columns
# Survival rate by gender and class
gender_class_survival = (
    df.groupby(["Sex", "Pclass"])["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 5. Boolean Filtering + GroupBy
# Survival rate of children (Age < 18) by gender
children_survival = (
    df[df["Age"] < 18]
    .groupby("Sex")["Survived"]
    .mean()
)

# --------------------------------------------------
# 6. Feature Engineering
# Create FamilySize column
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1

# --------------------------------------------------
# 7. GroupBy on Derived Column
# Survival rate by family size
family_survival = (
    df.groupby("FamilySize")["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 8. Complex Boolean Logic
# Passengers who paid more than average fare, traveled alone, and died

avg_fare = df["Fare"].mean()

high_fare_alone_died = df[
    (df["Fare"] > avg_fare) &
    (df["FamilySize"] == 1) &
    (df["Survived"] == 0)
]

# --------------------------------------------------
# 9. Using transform()
# Passengers who paid more than the average fare of their class
above_class_avg_fare = df[
    df["Fare"] > df.groupby("Pclass")["Fare"].transform("mean")
]

# --------------------------------------------------
# 10. GroupBy Summary Table
# Survival rate by class
class_survival = (
    df.groupby("Pclass")["Survived"]
    .mean()
    .reset_index(name="ClassSurvivalRate")
)

# --------------------------------------------------
# 11. Merge Summary Back to Main DataFrame
df = df.merge(class_survival, on="Pclass", how="left")

# --------------------------------------------------
# 12. Conditional Filtering Using Merged Data
# Passengers who survived less than their class average
below_class_avg_survival = df[
    df["Survived"] < df["ClassSurvivalRate"]
]

# --------------------------------------------------
# 13. Ranking Within Groups
# Rank passengers by fare within each class
df["FareRankInClass"] = (
    df.groupby("Pclass")["Fare"]
    .rank(ascending=False)
)

# --------------------------------------------------
# 14. Top 3 Highest Fare Passengers per Class
top_fare_passengers = (
    df[df["FareRankInClass"] <= 3]
    .sort_values(["Pclass", "FareRankInClass"])
)

# --------------------------------------------------
# 15. Pivot Table Example
# Survival count by gender and passenger class
survival_pivot = pd.pivot_table(
    df,
    values="Survived",
    index="Sex",
    columns="Pclass",
    aggfunc="sum"
)

# --------------------------------------------------
# 16. Competition-Style Query
# Embarked ports where 3rd class females had survival rate > 50%
high_survival_ports = (
    df[
        (df["Sex"] == "female") &
        (df["Pclass"] == 3)
    ]
    .groupby("Embarked")["Survived"]
    .mean()
    .reset_index()
    .query("Survived > 0.5")
)


# Titanic Dataset – Advanced GroupBy with Boolean Logic
# Competition-Focused Pandas Examples
#
# Key focus:
# - Boolean conditions BEFORE groupby
# - Boolean conditions AFTER aggregation
# - Conditional aggregation
# - Comparing groups against each other
# - Using transform() with boolean logic

import pandas as pd

# Load dataset
df = pd.read_csv("titanic.csv")

# --------------------------------------------------
# 1. Survival rate of females vs males in EACH class
# (Boolean logic inside groupby selection)
gender_class_survival = (
    df[df["Sex"].isin(["male", "female"])]
    .groupby(["Pclass", "Sex"])["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 2. Classes where FEMALE survival rate > MALE survival rate
# (Boolean logic AFTER aggregation)
female_vs_male = (
    df.groupby(["Pclass", "Sex"])["Survived"]
    .mean()
    .unstack()   # Converts Sex into columns
)

female_better_classes = female_vs_male[
    female_vs_male["female"] > female_vs_male["male"]
]

# --------------------------------------------------
# 3. Survival rate of passengers with family vs without family
# (Boolean feature + groupby)
df["HasFamily"] = (df["SibSp"] + df["Parch"]) > 0

family_survival = (
    df.groupby("HasFamily")["Survived"]
    .mean()
)

# --------------------------------------------------
# 4. Survival rate by class ONLY for passengers older than class average
# (Boolean logic using transform)
older_than_class_avg = df[
    df["Age"] > df.groupby("Pclass")["Age"].transform("mean")
]

older_survival_by_class = (
    older_than_class_avg
    .groupby("Pclass")["Survived"]
    .mean()
)

# --------------------------------------------------
# 5. Ports where survival rate of females > 60%
# (Boolean logic after groupby)
female_port_survival = (
    df[df["Sex"] == "female"]
    .groupby("Embarked")["Survived"]
    .mean()
    .reset_index()
)

high_female_survival_ports = female_port_survival[
    female_port_survival["Survived"] > 0.6
]

# --------------------------------------------------
# 6. Classes where rich passengers survived more than poor passengers
# Rich = Fare above class average
df["IsRichInClass"] = (
    df["Fare"] > df.groupby("Pclass")["Fare"].transform("mean")
)

rich_vs_poor_survival = (
    df.groupby(["Pclass", "IsRichInClass"])["Survived"]
    .mean()
    .unstack()
)

rich_better_classes = rich_vs_poor_survival[
    rich_vs_poor_survival[True] > rich_vs_poor_survival[False]
]

# --------------------------------------------------
# 7. Survival rate of children vs adults by class
# Children = Age < 18
df["IsChild"] = df["Age"] < 18

child_adult_survival = (
    df.groupby(["Pclass", "IsChild"])["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 8. Classes where CHILD survival > ADULT survival
child_vs_adult = (
    df.groupby(["Pclass", "IsChild"])["Survived"]
    .mean()
    .unstack()
)

child_advantage_classes = child_vs_adult[
    child_vs_adult[True] > child_vs_adult[False]
]

# --------------------------------------------------
# 9. Passengers who survived EVEN THOUGH their group survival < 40%
# (Very common competition pattern)
group_survival = (
    df.groupby(["Sex", "Pclass"])["Survived"]
    .mean()
    .reset_index(name="GroupSurvivalRate")
)

df = df.merge(group_survival, on=["Sex", "Pclass"], how="left")

rare_survivors = df[
    (df["Survived"] == 1) &
    (df["GroupSurvivalRate"] < 0.4)
]

# --------------------------------------------------
# 10. Families (FamilySize >= 4) with survival rate > overall average
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1

overall_survival_rate = df["Survived"].mean()

large_family_survival = (
    df[df["FamilySize"] >= 4]
    .groupby("FamilySize")["Survived"]
    .mean()
    .reset_index()
)

high_survival_large_families = large_family_survival[
    large_family_survival["Survived"] > overall_survival_rate
]

# --------------------------------------------------
# 11. Embarked ports where 3rd class survival < overall survival
third_class_survival_by_port = (
    df[df["Pclass"] == 3]
    .groupby("Embarked")["Survived"]
    .mean()
    .reset_index()
)

low_survival_ports = third_class_survival_by_port[
    third_class_survival_by_port["Survived"] < overall_survival_rate
]

# --------------------------------------------------
# 12. Identify passengers who paid HIGH fare but belonged to LOW survival group
df["HighFare"] = df["Fare"] > df["Fare"].median()

high_fare_low_group = df[
    (df["HighFare"] == True) &
    (df["GroupSurvivalRate"] < overall_survival_rate)
]

# Titanic Dataset – Advanced Feature Engineering (Multiple Columns)
# Competition-Oriented Pandas Examples
#
# Focus:
# - Creating features using multiple columns
# - Combining feature engineering with boolean logic
# - GroupBy on engineered features
# - Patterns commonly tested in analytics competitions

import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("titanic.csv")

# --------------------------------------------------
# 1. Family Size Feature (SibSp + Parch + Self)
df["FamilySize"] = df["SibSp"] + df["Parch"] + 1

# --------------------------------------------------
# 2. IsAlone Feature
# Passenger is alone if FamilySize == 1
df["IsAlone"] = df["FamilySize"] == 1

# --------------------------------------------------
# 3. Age Group Feature
# Categorize passengers into age buckets
df["AgeGroup"] = pd.cut(
    df["Age"],
    bins=[0, 12, 18, 35, 60, 100],
    labels=["Child", "Teen", "YoungAdult", "Adult", "Senior"]
)

# --------------------------------------------------
# 4. Fare Category Feature (Using Fare + Pclass)
# Categorize fare relative to class average
df["FareAboveClassAvg"] = (
    df["Fare"] > df.groupby("Pclass")["Fare"].transform("mean")
)

# --------------------------------------------------
# 5. Survival Risk Group Feature
# Combine Sex + Pclass into a single categorical feature
df["RiskGroup"] = df["Sex"] + "_Class_" + df["Pclass"].astype(str)

# --------------------------------------------------
# 6. Parent or Child Feature
# Passenger is parent or child if Parch > 0
df["IsParentOrChild"] = df["Parch"] > 0

# --------------------------------------------------
# 7. Family Type Feature
# Combine FamilySize and IsAlone
df["FamilyType"] = np.where(
    df["FamilySize"] == 1, "Solo",
    np.where(df["FamilySize"] <= 4, "SmallFamily", "LargeFamily")
)

# --------------------------------------------------
# 8. Wealth Indicator Feature
# HighFare AND First/Second class passengers
df["IsWealthy"] = (
    (df["Fare"] > df["Fare"].median()) &
    (df["Pclass"].isin([1, 2]))
)

# --------------------------------------------------
# 9. Child-with-Mother Indicator
# Female passengers with children
df["ChildWithMother"] = (
    (df["Sex"] == "female") &
    (df["Parch"] > 0)
)

# --------------------------------------------------
# 10. GroupBy on Engineered Features
# Survival rate by FamilyType
familytype_survival = (
    df.groupby("FamilyType")["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 11. Survival rate by AgeGroup and Pclass
agegroup_class_survival = (
    df.groupby(["AgeGroup", "Pclass"])["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 12. Survival comparison: Alone vs With Family per Class
alone_vs_family = (
    df.groupby(["Pclass", "IsAlone"])["Survived"]
    .mean()
    .unstack()
)

# --------------------------------------------------
# 13. High-Risk but Survived Passengers
# Male + 3rd class + survived
df["HighRisk"] = (
    (df["Sex"] == "male") &
    (df["Pclass"] == 3)
)

high_risk_survivors = df[
    (df["HighRisk"] == True) &
    (df["Survived"] == 1)
]

# --------------------------------------------------
# 14. Low-Risk but Did Not Survive
# Female + 1st class + died
df["LowRisk"] = (
    (df["Sex"] == "female") &
    (df["Pclass"] == 1)
)

low_risk_non_survivors = df[
    (df["LowRisk"] == True) &
    (df["Survived"] == 0)
]

# --------------------------------------------------
# 15. Survival Rate by Combined Risk & Wealth
risk_wealth_survival = (
    df.groupby(["HighRisk", "IsWealthy"])["Survived"]
    .mean()
    .reset_index()
)

# --------------------------------------------------
# 16. Competition-Style Question
# "Which FamilyType in 3rd class had survival rate above overall average?"

overall_survival = df["Survived"].mean()

familytype_3rdclass = (
    df[df["Pclass"] == 3]
    .groupby("FamilyType")["Survived"]
    .mean()
    .reset_index()
)

above_avg_familytype = familytype_3rdclass[
    familytype_3rdclass["Survived"] > overall_survival
]
