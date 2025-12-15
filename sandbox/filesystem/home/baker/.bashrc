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
echo "     Les Baguettes Internal System"
echo "==========================================="
echo ""
echo "Welcome, baker! You have logged into the bakery's"
echo "internal server. Please handle data with care."
echo ""
echo "Type 'challenges' to see your objectives"
echo "Type 'help' to see helpful commands"
echo ""
echo "-------------------------------------------"
echo ""
echo "Tervetuloa, leipuri! Olet kirjautunut leipomon"
echo "sisäiselle palvelimelle. Käsittele tietoja huolellisesti."
echo ""
echo "Kirjoita 'haasteet' nähdäksesi tehtävät"
echo "Kirjoita 'apua' nähdäksesi hyödyllisiä komentoja"
echo ""

# Custom help command (English)
help() {
    echo ""
    echo "Les Baguettes Internal System - Available Commands"
    echo "==================================================="
    echo ""
    echo "Navigation:      cd      - change directory"
    echo "                 ls      - list files"
    echo "                 ls -la  - list ALL files (including hidden)"
    echo "                 pwd     - show current directory"
    echo ""
    echo "File viewing:    cat     - show file contents"
    echo "                 less    - browse file (q = exit)"
    echo "                 head    - show beginning of file"
    echo "                 tail    - show end of file"
    echo ""
    echo "Searching:       grep    - search text in files"
    echo ""
    echo "Utilities:       base64  - encode/decode base64"
    echo ""
    echo "Type 'challenges' to see your objectives"
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
    echo "  [$task1] Find the secret recipe"
    echo "      (Hint: Try help command)"
    echo "  [$task2] Figure out what the message sent by the supplier contains"
    echo "      (Hint: Try base64 tool. Run 'base64 --help' -command to get more"
    echo "       information about how to use the tool)"
    echo "  [$task3] Find the important order made by a Premium member"
    echo "      (Hint: Try grep tool. Run 'grep --help' -command to get more"
    echo "       information about how to use the tool)"
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
    echo "  [$task1] Löydä salainen resepti"
    echo "      (Vinkki: Kokeile apua-komentoa)"
    echo "  [$task2] Selvitä mitä tavarantoimittajan viesti sisältää"
    echo "      (Vinkki: Kokeile base64-työkalua. Suorita 'base64 --help' -komento"
    echo "       saadaksesi lisätietoja työkalun käytöstä)"
    echo "  [$task3] Löydä Premium-asiakkaan tärkeä tilaus"
    echo "      (Vinkki: Kokeile grep-työkalua. Suorita 'grep --help' -komento"
    echo "       saadaksesi lisätietoja työkalun käytöstä)"
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
