import math

def setSameDir(des, src):
    if len(des) != len(src):
        return
    for i in range(0, len(src)):
        des[i] = src[i]

def sumDir(dir1, dir2):
    answer = []
    for i in range(0, len(dir1)):
        answer.append(dir1[i] + dir2[i])
    return answer

def subDir(dir1, dir2):
    answer = []
    for i in range(0, len(dir1)):
        answer.append(dir1[i] - dir2[i])
    return answer

def mulConst(num, dir):
    answer = []
    for i in range(0, len(dir)):
        answer.append(num * dir[i])
    return answer

def setZero(dir):
    for i in range(0, len(dir)):
        dir[i] = 0
    return

def isZero(dir):
    for i in range(0, len(dir)):
        if dir[i]:
            return False
    return True

def isSame(dir1, dir2):
    if len(dir1) != len(dir2):
        return False
    for i in range(0, len(dir1)):
        if dir1[i] != dir2[i]:
            return False
    return True

def dirLength(dir):
    return math.sqrt(dir[0] ** 2 + dir[1] ** 2 + dir[2] ** 2)

def dist(dir1, dir2):
    answer = 0
    for i in range(0, len(dir1)):
        answer += (dir1[i] - dir2[i]) ** 2
    answer = math.sqrt(answer)
    return answer

def cpyDir(dir):
    answer = []
    for i in range(0, len(dir)):
        answer.append(dir[i])
    return answer

def normalized(dir):
    answer = cpyDir(dir)
    length = dirLength(answer)
    answer = mulConst(1 / length, answer)
    return answer

def dot(dir1, dir2):
    answer = 0
    for i in range(0, len(dir1)):
        answer += dir1[i] * dir2[i]
    return answer