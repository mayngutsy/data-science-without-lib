classes={
"car":0,
"fish":1,
"house":2,
"tree":3,
"bicycle":4,
"guitar":5,
"pencil":6,
"clock":7
}

def readFeatureFile(filePath):
    f=open(filePath,"r")
    lines=f.readlines()
    print(lines[0])

    X=[]
    y=[]

    for i in range(1,len(lines)):
        row=lines[i].split(",")
        X.append(
            [float(row[j]) for j in range(len(row)-1)]
        )
        y.append(classes[row[-1].strip()])
    return X,y

from sklearn.neighbors import KNeighborsClassifier
Knn=KNeighborsClassifier(
    n_neighbors=50,
    algorithm="brute",
    weights="uniform"
)

X,y= readFeatureFile("../data/dataset/training.csv")
Knn.fit(X,y)

X,y= readFeatureFile("../data/dataset/testing.csv")

accuracy=Knn.score(X,y)
print("Accuracy:",accuracy)