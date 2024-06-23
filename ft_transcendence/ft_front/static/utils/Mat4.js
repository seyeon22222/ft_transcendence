export class Mat4 {
    static dot(m1, m2) {
        let ans = m1[0] * m2[0] + m1[1] * m2[1] + m1[2] * m2[2];
        return ans;
    }

    static sub(m1, m2) {
        let ans = [];
        for (let i = 0; i < 4; i++)
            ans.push(m1[i] - m2[i]);
        return ans;
    }

    static sum(m1, m2) {
        let ans = [];
        for (let i = 0; i < 4; i++)
            ans.push(m1[i] + m2[i]);
        return ans;
    }

    static mulConst(num, mat) {
        let ans = [];
        for (let i = 0; i < 3; i++)
            ans.push(mat[i] * num);
        return ans;
    }
};