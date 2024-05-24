class Geometry {
    constructor () {
        this.indices = [];
        this.vertices = [];
        this.pos;
        this.id;
    }
    
    createSphere() {
        const dTheta = 180.0 / 20.0;
        const theta = 360.0 / 20.0;

        for (let i = 0; i <= 20; i++) {
            let startPoint = Mat4x4.multipleMat4AndVec4(Mat4x4.rotMatAxisZ(dTheta * i), [0.0, -0.5, 0.0, 1.0]);
            for (let j = 0; j <= 20; j++) {
                let v = Mat4x4.multipleMat4AndVec4(Mat4x4.rotMatAxisY(theta * j), startPoint);
                this.vertices.push(v[0]);
                this.vertices.push(v[1]);
                this.vertices.push(v[2]);
            }
        }
        for (let i = 0; i < 20; i++) {
            let offset = 21 * i;
            for (let j = 0; j < 20; j++) {
                this.indices.push(offset + j);
                this.indices.push(offset + j + 1);
                this.indices.push(offset + 21 + j);

                this.indices.push(offset + j + 1);
                this.indices.push(offset + 21 + j + 1);
                this.indices.push(offset + 21 + j);
            }
        }
    }

    createBox(sizeWidth, sizeHeight) {
        let x = sizeWidth / 2.0;
        let y = sizeHeight / 2.0;
        const verticesData = [
            // 앞면(Back face)
            -x, -y, 0.1,  -x, y, 0.1,  x, y, 0.1,  x, -y, 0.1,
            
            // 뒷면(Front face)
            -x, -y, -0.1,   x, -y, -0.1,   x, y, -0.1,  -x, y, -0.1,

            // 윗면(Top face)
            -x, y, -0.1,  -x, y, 0.1,   x, y, 0.1,   x, y, -0.1,

            // 아랫면(Bottom face)
            -x, -y, -0.1,  -x, -y, 0.1,  x, -y, 0.1,  x, -y, -0.1,

            // 오른쪽면(Right face)
            x, y, -0.1,  x, -y, -0.1,  x, -y, 0.1,  x, y, 0.1,

            // 왼쪽면(Left face)
            -x, y, -0.1,  -x, y, 0.1,   -x, -y, 0.1,  -x, -y, -0.1,
        ];
        this.vertices = verticesData;
        let indicesData = [ 0, 2, 1, 0, 3, 2, // 앞
                         4, 6, 5, 4, 7, 6, // 뒤
                         8, 9, 10, 8, 10, 11, // 위
                         12, 15, 13, 15, 14, 13, // 아래
                         16, 19, 18, 16, 18, 17, // 오른 
                         21, 20, 22, 22, 20, 23]; // 왼
        this.indices = indicesData;
    }
};
