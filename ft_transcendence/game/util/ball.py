import math
import random
from . import ballUtils

MIN = 0.000000001

class Ball:
    def __init__(self):
        self.pos = [0, 0, 0]
        self.dir = [1, 0, 0]
        self.cnt1 = 0
        self.cnt2 = 0
        self.point1 = 0
        self.point2 = 0

    def reflectVector(self, normal):
        normal = ballUtils.normalized(normal)
        t = abs(ballUtils.dot(normal, self.dir)) * 2
        dir_vector = ballUtils.sumDir(ballUtils.mulConst(t, normal), self.dir)
        theta = math.radians(random.randrange(0, 360))
        tmp = [math.cos(theta), math.sin(theta), 0]
        tmp = ballUtils.mulConst(0.1, tmp)
        dir_vector = ballUtils.sumDir(dir_vector, tmp)
        return dir_vector
    
    def checkWallTop(self, after):
        if (self.pos[0] < 14.5 and self.pos[0] > -14.5) and (self.pos[1] < 7.5 and self.pos[1] > -7.5):
            if (after[1] >= 7.25):
                return True
        return False

    def checkWallBottom(self, after):
        if (self.pos[0] < 14.5 and self.pos[0] > -14.5) and (self.pos[1] < 7.5 and self.pos[1] > -7.5):
            if after[1] <= -7.25:
                return True
        return False

    def checkStick1(self, stk1, after):
        if after[0] > -14.5:
            return False
        d = ballUtils.subDir(after, self.pos)
        d = ballUtils.mulConst(1000, d)
        nex = ballUtils.sumDir(after, d)
        slope = (nex[1] - self.pos[1]) / (nex[0] - self.pos[0])
        y = slope * (-14.5 - self.pos[0]) + self.pos[1]
        if y <= stk1.top[1] and y >= stk1.bottom[1]:
            return True
        return False

    def checkStick2(self, stk2, after):
        if after[0] < 14.5:
            return False
        d = ballUtils.subDir(after, self.pos)
        d = ballUtils.mulConst(1000, d)
        nex = ballUtils.sumDir(after, d)
        slope = (nex[1] - self.pos[1]) / (nex[0] - self.pos[0])
        y = slope * (14.5 - self.pos[0]) + self.pos[1]
        if y <= stk2.top[1] and y >= stk2.bottom[1]:
            return True
        return False
    
    def update(self, stick1, stick2, speed):
        if self.pos[0] > 15 or self.pos[0] < -15:
            if (self.pos[0] < 0):
                self.point2 += 1
            else:
                self.point1 += 1
            self.pos = [0, 0, 0]
            self.dir = [-1, 0, 0]
            self.cnt1 = 0
            self.cnt2 = 0
            return False

        normal = [0, 0, 0]
        token = 0
        after = ballUtils.sumDir(self.pos, ballUtils.mulConst(speed, self.dir))
        if self.checkWallTop(after):
            token |= 1
        elif self.checkWallBottom(after):
            token |= (1 << 1)
        if self.checkStick1(stick1, after):
            token |= (1 << 2)
        elif self.checkStick2(stick2, after):
            token |= (1 << 3)
        if token:
            ans = [0, 0, 0]
            d = ballUtils.subDir(after, self.pos)
            d = ballUtils.mulConst(10000, d)
            nex = ballUtils.sumDir(after, d)
            slope = (nex[1] - self.pos[1]) / (nex[0] - self.pos[0])
            
            if token == 1:
                ans[0] = (7.25 - self.pos[1]) / slope + self.pos[0]
                ans[1] = 7.25
                normal = ballUtils.sumDir(normal, [0, -1, 0])
            
            elif token == 2:
                ans[0] = (-7.25 - self.pos[1]) / slope + self.pos[0]
                ans[1] = -7.25
                normal = ballUtils.sumDir(normal, [0, 1, 0])
            
            elif token == 4:
                ans[1] = slope * (-14.25 - self.pos[0]) + self.pos[1]
                ans[0] = -14.25
                self.cnt1 += 1
                normal = ballUtils.sumDir(normal, [1, 0, 0])
            
            elif token == 8:
                ans[1] = slope * (14.25 - self.pos[0]) + self.pos[1]
                ans[0] = 14.25
                self.cnt2 += 1
                normal = ballUtils.sumDir(normal, [-1, 0, 0])
            
            elif token == 5:
                dot_1 = ballUtils.dot([0, -1, 0], ballUtils.mulConst(-1, self.dir))
                dot_2 = ballUtils.dot([1, 0, 0], ballUtils.mulConst(-1, self.dir))
                if dot_1 <= dot_2:
                    ans[1] = slope * (-14.25 - self.pos[0]) + self.pos[1]
                    ans[0] = -14.25
                    self.cnt1 += 1
                else:
                    ans[0] = (7.25 - self.pos[1]) / slope + self.pos[0]
                    ans[1] = 7.25
                distX = abs(ans[0] - (-14.25))
                distY = abs(ans[1] - (7.25))
                if distX <= MIN and distY <= MIN:
                    normal = ballUtils.sumDir(normal, [0, -1, 0])
                    normal = ballUtils.sumDir(normal, [1, 0, 0])
                elif distX <= MIN:
                    normal = ballUtils.sumDir(normal, [1, 0, 0])
                else:
                    normal = ballUtils.sumDir(normal, [0, -1, 0])
            
            elif token == 6:
                dot_1 = ballUtils.dot([0, 1, 0], ballUtils.mulConst(-1, self.dir))
                dot_2 = ballUtils.dot([1, 0, 0], ballUtils.mulConst(-1, self.dir))
                if dot_1 <= dot_2:
                    ans[1] = slope * (-14.25 - self.pos[0]) + self.pos[1]
                    ans[0] = -14.25
                    self.cnt1 += 1
                else:
                    ans[0] = (-7.25 - self.pos[1]) / slope + self.pos[0]
                    ans[1] = -7.25
                distX = abs(ans[0] - (-14.25))
                distY = abs(ans[1] - (-7.25))
                if distX <= MIN and distY <= MIN:
                    normal = ballUtils.sumDir(normal, [0, 1, 0])
                    normal = ballUtils.sumDir(normal, [1, 0, 0])
                elif distX <= MIN:
                    normal = ballUtils.sumDir(normal, [1, 0, 0])
                else:
                    normal = ballUtils.sumDir(normal, [0, 1, 0])
            
            elif token == 9:
                dot_1 = ballUtils.dot([0, -1, 0], ballUtils.mulConst(-1, self.dir))
                dot_2 = ballUtils.dot([-1, 0, 0], ballUtils.mulConst(-1, self.dir))
                if dot_1 <= dot_2:
                    ans[1] = slope * (14.25 - self.pos[0]) + self.pos[1]
                    ans[0] = 14.25
                    self.cnt2 += 1
                else:
                    ans[0] = (7.25 - self.pos[1]) / slope + self.pos[0]
                    ans[1] = 7.25
                distX = abs(ans[0] - (14.25))
                distY = abs(ans[1] - (7.25))
                if distX <= MIN and distY <= MIN:
                    normal = ballUtils.sumDir(normal, [0, -1, 0])
                    normal = ballUtils.sumDir(normal, [-1, 0, 0])
                elif distX <= MIN:
                    normal = ballUtils.sumDir(normal, [-1, 0, 0])
                else:
                    normal = ballUtils.sumDir(normal, [0, -1, 0])
            
            elif token == 10:
                dot_1 = ballUtils.dot([0, 1, 0], ballUtils.mulConst(-1, self.dir))
                dot_2 = ballUtils.dot([-1, 0, 0], ballUtils.mulConst(-1, self.dir))
                if dot_1 <= dot_2:
                    ans[1] = slope * (14.25 - self.pos[0]) + self.pos[1]
                    ans[0] = 14.25
                    self.cnt2 += 1
                else:
                    ans[0] = (-7.25 - self.pos[1]) / slope + self.pos[0]
                    ans[1] = -7.25
                distX = abs(ans[0] - (14.25))
                distY = abs(ans[1] - (7.25))
                if distX <= MIN and distY <= MIN:
                    normal = ballUtils.sumDir(normal, [0, 1, 0])
                    normal = ballUtils.sumDir(normal, [-1, 0, 0])
                elif distX <= MIN:
                    normal = ballUtils.sumDir(normal, [-1, 0, 0])
                else:
                    normal = ballUtils.sumDir(normal, [0, 1, 0])
            reflect_dir = self.reflectVector(normal)
            reflect_dir = ballUtils.normalized(reflect_dir)
            if abs(reflect_dir[0]) < 0.01:
                if self.cnt1 > self.cnt2:
                    reflect_dir = ballUtils.sumDir(reflect_dir, [1, 0, 0])
                else:
                    reflect_dir = ballUtils.sumDir(reflect_dir, [-1, 0, 0])
                reflect_dir = ballUtils.normalized(reflect_dir)
            ballUtils.setSameDir(self.dir, reflect_dir)
            ballUtils.setSameDir(self.pos, ans)
        else:
            ballUtils.setSameDir(self.pos, after)
        return True

class Stick:
    def __init__(self, position):
        self.pos = position
        if self.pos[0] < 0:
            self.top = [self.pos[0] + 0.25, self.pos[1] + 1.5, 0]
            self.bottom = [self.pos[0] + 0.25, self.pos[1] - 1.5, 0]
        else:
            self.top = [self.pos[0] - 0.25, self.pos[1] + 1.5, 0]
            self.bottom = [self.pos[0] - 0.25, self.pos[1] - 1.5, 0]
        self.dir = [0, 0, 0]

    def update(self, move):
        if self.top[1] + move > 7.75 or self.bottom[1] + move < -7.75:
            self.dir = [0, 0, 0]
            return
        self.top[1] += move
        self.bottom[1] += move
        self.pos[1] += move
        self.dir = [0, 1, 0] if move > 0 else [0, -1, 0] if move < 0 else [0, 0, 0]