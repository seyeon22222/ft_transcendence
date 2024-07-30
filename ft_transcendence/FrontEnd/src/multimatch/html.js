export function multiMatch_html() {
    return `      
    <body>
        <div class="p-10 lg:p-20 text-center">
            <h1 class="text-3xl lg:text-6xl" id="match_name"></h1>
        </div>
        <div class="theme theme-dark">
            <div class="bracket">
                <div class="column">
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="semi_final1"></span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="semi_final2"></span>
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
                            <span class="name" id="semi_final3"></span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="semi_final4"></span>
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
                <div class="column">
                    <div class="match winner-top">
                        <div class="match-top team">
                            <span class="image"></span>
                            <span class="name" id="final1"></span>
                        </div>
                        <div class="match-bottom team">
                            <span class="image"></span>
                            <span class="name" id="final2"></span>
                        </div>
                        <div class="match-lines">
                            <div class="line three"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    </div>        
                </div>
            </div>
    </body>       
    `;
  }