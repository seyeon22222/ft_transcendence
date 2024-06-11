import math
import random
from . import ballUtils
from . import mat3
import copy

MIN = 0.0000000001

class Ball:
    def __init__(self, radius):
        self.pos = [0, 0, 1]
        self.dir = [-1, 0, 0]
        self.point1 = 0
        self.point2 = 0
        self.radius = radius
        self.is_active = 1

    def reflectVector(self, normal):
        normal = ballUtils.normalized(normal)
        t = abs(ballUtils.dot(normal, self.dir)) * 2
        dir_vector = ballUtils.sumDir(ballUtils.mulConst(t, normal), self.dir)
        theta = math.radians(random.randrange(0, 360))
        tmp = [math.cos(theta), math.sin(theta), 0]
        tmp = ballUtils.mulConst(0.1, tmp)
        dir_vector = ballUtils.sumDir(dir_vector, tmp)
        return dir_vector
    
    def update(self, sticks, obstacles, speed):
        left = sticks[0].pos[0]
        right = sticks[0].pos[0]
        for i in range(0, len(sticks)):
            left = min(left, sticks[i].pos[0])
            right = max(right, sticks[i].pos[0])
        if self.pos[0] > right or self.pos[0] < left:
            if (self.pos[0] < 0):
                self.point2 += 1
            else:
                self.point1 += 1
            self.pos = [0, 0, 1]
            self.dir = [-1, 0, 0]
            return False

        normal_s = [0, 0, 0]
        normal_o = [0, 0, 0]
        after = ballUtils.sumDir(self.pos, ballUtils.mulConst(speed, self.dir))
        res = []
        d = -1
        for i in range(0, len(sticks)):
            tmp = sticks[i].collision(self.pos, after, self.radius)
            if tmp[0][0] >= 0 and (d < 0 or tmp[0][0] < d):
                d = tmp[0][0]
                normal_s = ballUtils.sumDir(normal_s, tmp[2])
                res = copy.deepcopy(tmp[1])
                break

        for i in range(0, len(obstacles)):
            tmp = obstacles[i].collision(self.pos, after, self.radius)
            if tmp[0][0] >= 0:
                if abs(tmp[0][0] - d) <= MIN:
                    normal_o = ballUtils.sumDir(normal_o, tmp[2])
                elif tmp[0][0] < d or d < 0:
                    d = tmp[0][0]
                    normal_o = copy.deepcopy(tmp[2])
                    res = copy.deepcopy(tmp[1])
        if d >= 0:
            self.pos = copy.deepcopy(res)
            normal = ballUtils.sumDir(normal_o, normal_s)
            reflect_dir = self.reflectVector(normal)
            reflect_dir = ballUtils.normalized(reflect_dir)
            if abs(reflect_dir[0]) < 0.01:
                if self.dir[0] > 0:
                    reflect_dir = ballUtils.sumDir(reflect_dir, [1, 0, 0])
                else:
                    reflect_dir = ballUtils.sumDir(reflect_dir, [-1, 0, 0])
                reflect_dir = ballUtils.normalized(reflect_dir)
            self.dir = ballUtils.normalized(reflect_dir)
        else:
            self.pos = copy.deepcopy(after)
        return True

class Box:
    def __init__(self, size_x, size_y):
        len_x = size_x / 2
        len_y = size_y / 2
        self.width = size_x
        self.height = size_y
        self.pos = [0, 0, 0]
        self.top1 = [-len_x, len_y, 1]
        self.top2 = [len_x, len_y, 1]
        self.bot1 = [len_x, -len_y, 1]
        self.bot2 = [-len_x, -len_y, 1]
        self.right = ballUtils.subDir(self.top2, self.top1)
        self.right = ballUtils.normalized(self.right)
        self.up = ballUtils.subDir(self.top2, self.bot1)
        self.up = ballUtils.normalized(self.up)
        self.degree = 0
    
    def rotBox(self, degree):
        rot = mat3.transformMat(0, 0, degree)
        self.degree = degree
        self.top1 = mat3.mulMat3xPoint(rot, self.top1)
        self.top2 = mat3.mulMat3xPoint(rot, self.top2)
        self.bot1 = mat3.mulMat3xPoint(rot, self.bot1)
        self.bot2 = mat3.mulMat3xPoint(rot, self.bot2)
        self.pos = mat3.mulMat3xPoint(rot, self.pos)
        self.right = mat3.mulMat3xPoint(rot, self.right)
        self.up = mat3.mulMat3xPoint(rot, self.up)
    
    def movePos(self, pos):
        self.pos = copy.deepcopy(pos)
        self.pos[2] = 1
        t_mat = mat3.transformMat(pos[0], pos[1], 0)
        self.top1 = mat3.mulMat3xPoint(t_mat, self.top1)
        self.top2 = mat3.mulMat3xPoint(t_mat, self.top2)
        self.bot1 = mat3.mulMat3xPoint(t_mat, self.bot1)
        self.bot2 = mat3.mulMat3xPoint(t_mat, self.bot2)
        
        
    def collision(self, ball_here, ball_next, r):
        ans = []
        normal = [0, 0, 0]
        here = copy.deepcopy(ball_here)
        next = copy.deepcopy(ball_next)
        mat_inv = mat3.invMat(self.pos[0], self.pos[1], self.degree)
        here = mat3.mulMat3xPoint(mat_inv, here)
        next = mat3.mulMat3xPoint(mat_inv, next)
        aabb = Box(self.width + 2 * r, self.height + 2 * r)
        d = ballUtils.subDir(next, here)
        d = ballUtils.normalized(d)
        
        # up
        dn = ballUtils.dot(d, [0, 1, 0])
        os = ballUtils.subDir(aabb.top1, here)
        osn = ballUtils.dot(os, [0, 1, 0])
        dist = -1
        cp = []
        if dn < 0 and next[1] <= aabb.top1[1] and here[1] >= aabb.top1[1]:
            t = osn / dn
            p = ballUtils.sumDir(here, ballUtils.mulConst(t, d))
            if p[0] >= aabb.top1[0] and p[0] <= aabb.top2[0]:
                normal = [0, 1, 0]
                dist = t
                cp = copy.deepcopy(p)
        
        # down
        dn = ballUtils.dot(d, [0, -1, 0])
        os = ballUtils.subDir(aabb.bot2, here)
        osn = ballUtils.dot(os, [0, -1, 0])
        if dn < 0 and next[1] >= aabb.bot1[1] and here[1] <= aabb.bot1[1]:
            t = osn / dn
            p = ballUtils.sumDir(here, ballUtils.mulConst(t, d))
            if p[0] >= aabb.top1[0] and p[0] <= aabb.top2[0]:
                if t < dist or dist < 0:
                    dist = t
                    normal = [0, -1, 0]
                    cp = copy.deepcopy(p)
                elif abs(t - dist) < MIN:
                    normal = ballUtils.sumDir(normal, [0, -1, 0])
        
        #right
        dn = ballUtils.dot(d, [1, 0, 0])
        os = ballUtils.subDir(aabb.top2, here)
        osn = ballUtils.dot(os, [1, 0, 0])
        if dn < 0 and next[0] <= aabb.top2[0] and here[0] >= aabb.top2[0]:
            t = osn / dn
            p = ballUtils.sumDir(here, ballUtils.mulConst(t, d))
            if p[1] <= aabb.top1[1] and p[1] >= aabb.bot1[1]:
                if t < dist or dist < 0:
                    dist = t
                    normal = [1, 0, 0]
                    cp = copy.deepcopy(p)
                elif abs(t - dist) < MIN:
                    normal = ballUtils.sumDir(normal, [1, 0, 0])
        
        #left
        dn = ballUtils.dot(d, [-1, 0, 0])
        os = ballUtils.subDir(aabb.top1, here)
        osn = ballUtils.dot(os, [-1, 0, 0])
        if dn < 0 and next[0] >= aabb.top1[0] and here[0] <= aabb.top1[0]:
            t = osn / dn
            p = ballUtils.sumDir(here, ballUtils.mulConst(t, d))
            if p[1] <= aabb.top1[1] and p[1] >= aabb.bot1[1]:
                if t < dist or dist < 0:
                    dist = t
                    normal = [-1, 0, 0]
                    cp = copy.deepcopy(p)
                elif abs(t - dist) < MIN:
                    normal = ballUtils.sumDir(normal, [-1, 0, 0])
        ans.append([dist])
        if dist >= 0:
            cp = mat3.mulMat3xPoint(mat3.transformMat(self.pos[0], self.pos[1], self.degree), cp)
        normal = mat3.mulMat3xPoint(mat3.transformMat(0, 0, self.degree), normal)
        ans.append(cp)
        ans.append(normal)
        return ans
        
        
        
class Stick:
    def __init__(self, position, width, height):
        self.pos = position
        self.width = width
        self.height = height
        w = self.width / 2
        h = self.height / 2
        if self.pos[0] < 0:
            self.top = [self.pos[0] + w, self.pos[1] + h, 1]
            self.bottom = [self.pos[0] + w, self.pos[1] - h, 1]
        else:
            self.top = [self.pos[0] - w, self.pos[1] + h, 1]
            self.bottom = [self.pos[0] - w, self.pos[1] - h, 1]
        self.dir = [0, 0, 0]

    def update(self, move, top, bottom):
        if self.top[1] + move > top or self.bottom[1] + move < bottom:
            self.dir = [0, 0, 0]
            return
        self.top[1] += move
        self.bottom[1] += move
        self.pos[1] += move
        if move > 0:
            self.dir = [0, 1, 0]
        elif move < 0:
            self.dir = [0, -1, 0]
        else:
            self.dir = [0, 0, 0]
    
    def collision(self, ball_here, ball_next, r):
        ans = []
        normal = [0, 0, 0]
        here = copy.deepcopy(ball_here)
        next = copy.deepcopy(ball_next)
        d = ballUtils.subDir(next, here)
        d = ballUtils.mulConst(1000, d)
        nex = ballUtils.sumDir(next, d)
        slope = (nex[1] - here[1]) / (nex[0] - here[0])
        nx = 0
        if self.top[0] < 0:
            nx = self.top[0] + r
        else:
            nx = self.top[0] - r
        ny = slope * (nx - here[0]) + here[1]
        if ny > self.top[1] + r / 2 or ny < self.bottom[1] - r / 2:
            ans.append([-1])
            return ans
        if (self.top[0] < 0 and next[0] > nx) or (self.top[0] > 0 and next[0] < nx):
            ans.append([-1])
            return ans
        normal = [0, 0, 0]
        if self.top[0] < 0:
            normal[0] = 1
        else:
            normal[0] = -1
        collision_point = [nx, ny, 1]
        dist = ballUtils.dirLength(ballUtils.subDir(collision_point, here))
        ans.append([dist])
        ans.append(collision_point)
        ans.append(normal)
        return ans