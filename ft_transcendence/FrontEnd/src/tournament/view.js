export function tournament_view(tournament_player) {
    const winner = document.getElementById(`final`);
    winner.innerHTML = '';
    for (let i = 1; i <= 2; ++i) {
        const semi_final = document.getElementById(`semi_final${i}`);
        semi_final.innerHTML = '';
    }
    for (let i = 1; i <= 4; ++i) {
        const quarter_final = document.getElementById(`quarter_final${i}`);
        quarter_final.innerHTML = '';
    }
    for (let i = 1; i <= 8; ++i) {
        const round_16 = document.getElementById(`Round_8_${i}`);
        round_16.innerHTML = '';
    }

    if (tournament_player.length > 4 && tournament_player.length <= 8) {
        for (let i = 1; i <= tournament_player.length; ++i) {
            const round_16 = document.getElementById(`Round_8_${i}`);
            round_16.innerHTML = tournament_player[i - 1].nickname;
        }
    } else if (tournament_player.length > 2 && tournament_player.length <= 4) {
        for (let i = 1; i <= tournament_player.length; ++i) {
            const quarter_final = document.getElementById(`quarter_final${i}`);
            quarter_final.innerHTML = tournament_player[i - 1].nickname;
        }
    } else {
        for (let i = 1; i <= tournament_player.length; ++i) {
            const semi_final = document.getElementById(`semi_final${i}`);
            semi_final.innerHTML = tournament_player[i - 1].nickname;
        }
    }
}

export function after_start_view(tournament_player) {
    for (let i = 1; i <= tournament_player.length; ++i) {
        if (tournament_player[i - 1].level === 1) {
            const final = document.getElementById(`final`);
            final.innerHTML = tournament_player[i - 1].nickname;

            if (tournament_player.length > 2) {
                if (tournament_player.length > 4) {
                    const semifinal = document.getElementById(`semi_final${Math.ceil(i / 4)}`);
                    semifinal.innerHTML = tournament_player[i - 1].nickname;
                } else {
                    const semifinal = document.getElementById(`semi_final${Math.ceil(i / 2)}`);
                    semifinal.innerHTML = tournament_player[i - 1].nickname;
                }
            }

            if (tournament_player.length > 4) {
                if (tournament_player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                    } else if (i === 5) {
                        const semifinal = document.getElementById(`quarter_final3`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    } else {
                        const semifinal = document.getElementById(`quarter_final4`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    }
                } else {
                    const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                    quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                }
            }
        } else if (tournament_player[i - 1].level === 2) {
            if (tournament_player.length > 2) {
                if (tournament_player.length > 4) {
                    const semifinal = document.getElementById(`semi_final${Math.ceil(i / 4)}`);
                    semifinal.innerHTML = tournament_player[i - 1].nickname;
                } else {
                    const semifinal = document.getElementById(`semi_final${Math.ceil(i / 2)}`);
                    semifinal.innerHTML = tournament_player[i - 1].nickname;
                }
            }
            
            if (tournament_player.length > 4) {
                if (tournament_player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                    } else if (i === 5) {
                        const semifinal = document.getElementById(`quarter_final3`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    } else {
                        const semifinal = document.getElementById(`quarter_final4`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    }
                } else {
                    const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                    quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                }
            }
        } else if (tournament_player[i - 1].level === 3) {
            if (tournament_player.length > 4) {
                if (tournament_player.length === 6) {
                    if (i <= 4) {
                        const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                        quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                    } else if (i === 5) {
                        const semifinal = document.getElementById(`quarter_final3`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    } else {
                        const semifinal = document.getElementById(`quarter_final4`);
                        semifinal.innerHTML = tournament_player[i - 1].nickname;
                    }
                } else {
                    const quarterfinal = document.getElementById(`quarter_final${Math.ceil(i / 2)}`);
                    quarterfinal.innerHTML = tournament_player[i - 1].nickname;
                }
            }
        }
    }
}