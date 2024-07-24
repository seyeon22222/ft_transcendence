
export class ScreenSupport extends GameObject {
	constructor() {
		super();
		this.transform = new Transform();
		this.renderer = new Renderer(this);
		this.renderer.vao = MeshAsset.screen_support;
		this.renderer.program = MaterialAsset.screen_support;
		this.renderer.count = 8088;
	}
	start(parent) {
		this.transform.start(parent);
		this.renderer.start();
		super.start();
	}
	update(parent) {
		this.transform.update(parent);
		this.renderer.update();
		super.update();
	}
}