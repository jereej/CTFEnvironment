# ~/.bashrc: executed by bash for non-login shells

# Custom prompt matching the bakery theme
PS1='\[\033[01;32m\]baker@lesbaguettes\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# Helpful aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias cls='clear'

# Progress tracking directory
PROGRESS_DIR="/tmp/.ctf_progress"
mkdir -p "$PROGRESS_DIR" 2>/dev/null

# Task completion commands
complete_recipe() {
    touch "$PROGRESS_DIR/task1_done"
    echo ""
    echo "  ✓ Task completed: Secret recipe found!"
    echo "  ✓ Tehtävä suoritettu: Salainen resepti löydetty!"
    echo ""
}

complete_message() {
    touch "$PROGRESS_DIR/task2_done"
    echo ""
    echo "  ✓ Task completed: Supplier message decoded!"
    echo "  ✓ Tehtävä suoritettu: Tavarantoimittajan viesti dekoodattu!"
    echo ""
}

complete_order() {
    touch "$PROGRESS_DIR/task3_done"
    echo ""
    echo "  ✓ Task completed: Premium order found!"
    echo "  ✓ Tehtävä suoritettu: Premium-tilaus löydetty!"
    echo ""
}

# Welcome message on login
echo ""
echo "==========================================="
echo "   Les Baguettes Internal System v2.1"
echo "==========================================="
echo ""
echo "Tervetuloa, leipuri! Olet kirjautunut sisäiselle"
echo "palvelimelle. Käsittele tietoja huolellisesti."
echo ""
echo "Welcome, baker! You have logged into the"
echo "internal server. Please handle data with care."
echo ""
echo "Kirjoita 'apua' nähdäksesi komennot"
echo "Kirjoita 'haasteet' nähdäksesi tehtävät"
echo ""
echo "Type 'help' for available commands"
echo "Type 'challenges' to see your objectives"
echo ""

# Custom help command (English)
help() {
    echo ""
    echo "Les Baguettes Internal System - Available Commands"
    echo "==================================================="
    echo ""
    echo "Navigation:    cd, ls, pwd"
    echo "File viewing:  cat, less, head, tail"
    echo "Searching:     grep"
    echo "Utilities:     base64"
    echo ""
    echo "Type 'challenges' to see your objectives"
    echo "(Kirjoita 'apua' suomeksi / 'haasteet' tehtäviin)"
    echo ""
}

# Custom help command (Finnish)
apua() {
    echo ""
    echo "Les Baguettes - Käytettävissä olevat komennot"
    echo "=============================================="
    echo ""
    echo "Navigointi:      cd      - vaihda kansiota"
    echo "                 ls      - listaa tiedostot"
    echo "                 ls -la  - listaa KAIKKI tiedostot (myös piilotetut)"
    echo "                 pwd     - näytä nykyinen kansio"
    echo ""
    echo "Tiedostojen      cat     - näytä tiedoston sisältö"
    echo "katselu:         less    - selaa tiedostoa (q = poistu)"
    echo "                 head    - näytä tiedoston alku"
    echo "                 tail    - näytä tiedoston loppu"
    echo ""
    echo "Etsiminen:       grep    - etsi tekstiä tiedostoista"
    echo ""
    echo "Työkalut:        base64  - koodaa/dekoodaa base64"
    echo ""
    echo "Kirjoita 'haasteet' nähdäksesi tehtävät"
    echo ""
}

# Challenges list (English)
challenges() {
    local task1=" "
    local task2=" "
    local task3=" "

    [ -f "$PROGRESS_DIR/task1_done" ] && task1="X"
    [ -f "$PROGRESS_DIR/task2_done" ] && task2="X"
    [ -f "$PROGRESS_DIR/task3_done" ] && task3="X"

    echo ""
    echo "============================================================"
    echo "           LES BAGUETTES CTF CHALLENGES                     "
    echo "============================================================"
    echo ""
    echo "  [$task1] Find the secret recipe (hint: ls -la)"
    echo "  [$task2] Figure out what the message sent by the supplier contains"
    echo "      (hint: use base64 tool, try 'base64 --help' for usage)"
    echo "  [$task3] Find the important order made by a Premium member"
    echo "      (hint: use grep command, try 'grep --help' for usage)"
    echo ""

    # Check if all tasks are complete
    if [ -f "$PROGRESS_DIR/task1_done" ] && [ -f "$PROGRESS_DIR/task2_done" ] && [ -f "$PROGRESS_DIR/task3_done" ]; then
        echo "  ★ ALL TASKS COMPLETED! ★"
        echo ""
        echo "  Your flag: BAGUETTE{shell_master_baker}"
        echo ""
    fi

    echo "============================================================"
    echo ""
}

# Challenges list (Finnish)
haasteet() {
    local task1=" "
    local task2=" "
    local task3=" "

    [ -f "$PROGRESS_DIR/task1_done" ] && task1="X"
    [ -f "$PROGRESS_DIR/task2_done" ] && task2="X"
    [ -f "$PROGRESS_DIR/task3_done" ] && task3="X"

    echo ""
    echo "============================================================"
    echo "           LES BAGUETTES CTF-HAASTEET                       "
    echo "============================================================"
    echo ""
    echo "  [$task1] Löydä salainen resepti (vinkki: ls -la)"
    echo "  [$task2] Selvitä mitä tavarantoimittajan viesti sisältää"
    echo "      (vinkki: käytä base64 työkalua, kokeile 'base64 --help')"
    echo "  [$task3] Löydä Premium-asiakkaan tärkeä tilaus"
    echo "      (vinkki: käytä grep-komentoa, kokeile 'grep --help')"
    echo ""

    # Check if all tasks are complete
    if [ -f "$PROGRESS_DIR/task1_done" ] && [ -f "$PROGRESS_DIR/task2_done" ] && [ -f "$PROGRESS_DIR/task3_done" ]; then
        echo "  ★ KAIKKI TEHTÄVÄT SUORITETTU! ★"
        echo ""
        echo "  Lippusi: BAGUETTE{shell_master_baker}"
        echo ""
    fi

    echo "============================================================"
    echo ""
}

export -f help
export -f apua
export -f challenges
export -f haasteet
export -f complete_recipe
export -f complete_message
export -f complete_order
export PROGRESS_DIR
