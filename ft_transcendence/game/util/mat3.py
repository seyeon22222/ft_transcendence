import math

def transformMat(x, y, degree):
    res = []
    rad = math.radians(degree)
    res.append([math.cos(rad), -math.sin(rad), x])
    res.append([math.sin(rad), math.cos(rad), y])
    res.append([0, 0, 1])
    return res

def mulMat3xMat3(m1, m2):
    res = []
    for i in range(0, 3):
      temp = []
      for j in range(0, 3):
        total = 0
        for k in range(0, 3):
          total += m1[i][k] * m2[k][j]
        temp.append(total)
      res.append(temp) 
    return res

def mulMat3xPoint(mat, point):
    res = []
    for i in range(0, 3):
        total = 0
        for j in range(0, 3):
            total += mat[i][j] * point[j]
        res.append(total)
    return res

def invMat(x, y, degree):
    t_mat = transformMat(-x, -y, 0)
    r_mat = transformMat(0, 0, -degree)
    inv = mulMat3xMat3(r_mat, t_mat)
    return inv