export function multiMatch_html() {
    return `
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl" id="tournament_name"></h1>
        </div>
        <div class="theme theme-dark">
            <div class="bracket disable-borders">
                <div class="column one">
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_1"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_2"></span>
                            <span class="score">1</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                    <div class="match winner-bottom">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_3"></span>
                            <span class="score">1</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_4"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_5"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_6"></span>
                            <span class="score">0</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_7"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="Round_8_8"></span>
                            <span class="score">1</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                </div>
                <div class="column two">
                    <div class="match winner-bottom">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="quarter_final1"></span>
                            <span class="score">1</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="quarter_final2"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                    <div class="match winner-bottom">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="quarter_final3"></span>
                            <span class="score">1</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="quarter_final4"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>
                </div>
                <div class="column three">
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="semi_final1"></span>
                            <span class="score">3</span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="semi_final2"></span>
                            <span class="score">2</span>
                        </div>
                        <div class="match-lines">
                            <div class="line three"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>        
                </div>
                <div class="column four">
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="final"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <input type="text" id="nickname_input" placeholder="별칭을 입력하세요">
                <button type="button" id="tournament_button">토너먼트 신청</button>
            </div>

            <div id="button_container">
                <button type="button" id="tournament_start">토너먼트 시작</button>
            </div>

        </div>
    `;   
}