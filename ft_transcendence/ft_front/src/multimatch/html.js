// TODO : 토너먼트와 비슷한 뷰를 가지도록 내용 수정 / 2:2이기 때문에, 팀1 vs 팀2  -> 승자가 출력되는 형식으로 수정

export function multiMatch_html() {
    return `
		<div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl" id="match_name"></h1>
        </div>
		<div class="theme theme-dark">
			<div class="bracket disable-borders">
				<div class="column">
					<div class="match">
						<div class="match-top team" id="final1">
							<span class="image"></span>
							<span class="name"></span>
						</div>
						<div class="match-bottom team" id="final2">
							<span class="image"></span>
							<span class="name"></span>
						</div>
					</div>
				</div>
			</div>
			<div class="bracket disable-borders">
				<div class="column">
                    <div class="match">
                        <div class="match-top team" id="semi_final1">
                            <span class="image"></span>
                            <span class="name"></span>
                        </div>
                        <div class="match-bottom team" id="semi_final2">
                            <span class="image"></span>
                            <span class="name"></span>
                        </div>
                    </div>
                </div>
				<div class="column">
					<div class="match-lines">
						<div class="line"></div>
					</div>
				</div>
				<div class="column">
                    <div class="match">
                        <div class="match-top team" id="semi_final3">
                            <span class="image"></span>
                            <span class="name"></span>
                        </div>
                        <div class="match-bottom team" id="semi_final4">
                            <span class="image"></span>
                            <span class="name"></span>
                        </div>
                    </div>        
                </div>
			</div>
		</div>
    `;   
}
