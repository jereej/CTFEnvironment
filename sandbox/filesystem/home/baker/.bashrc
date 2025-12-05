# ~/.bashrc: executed by bash for non-login shells

# Custom prompt matching the bakery theme
PS1='\[\033[01;32m\]baker@lesbaguettes\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# Helpful aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias cls='clear'

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
    echo "Navigation:    cd, ls, pwd, tree"
    echo "File viewing:  cat, less, head, tail"
    echo "Searching:     grep, find"
    echo "Text editing:  nano, vim"
    echo "Utilities:     file, strings, base64, xxd"
    echo "Archives:      tar, gzip, gunzip"
    echo "Database:      sqlite3"
    echo "System:        backup_tool.sh (maintenance)"
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
    echo "                 tree    - näytä kansiorakenne"
    echo ""
    echo "Tiedostojen      cat     - näytä tiedoston sisältö"
    echo "katselu:         less    - selaa tiedostoa (q = poistu)"
    echo "                 head    - näytä tiedoston alku"
    echo "                 tail    - näytä tiedoston loppu"
    echo ""
    echo "Etsiminen:       grep    - etsi tekstiä tiedostoista"
    echo "                 find    - etsi tiedostoja nimellä"
    echo ""
    echo "Muokkaus:        nano    - helppo tekstieditori"
    echo "                 vim     - edistynyt tekstieditori"
    echo ""
    echo "Työkalut:        file    - tunnista tiedostotyyppi"
    echo "                 strings - näytä teksti binäärista"
    echo "                 base64  - koodaa/dekoodaa base64"
    echo "                 xxd     - näytä heksadesimaali"
    echo ""
    echo "Arkistot:        tar     - pura/pakkaa arkistoja"
    echo "                 gzip    - pakkaa tiedostoja"
    echo "                 gunzip  - pura pakattu tiedosto"
    echo ""
    echo "Tietokanta:      sqlite3 - SQLite-tietokanta"
    echo ""
    echo "Järjestelmä:     backup_tool.sh (ylläpito)"
    echo ""
    echo "Kirjoita 'haasteet' nähdäksesi tehtävät"
    echo ""
}

# Challenges list (English)
challenges() {
    echo ""
    echo "============================================================"
    echo "           LES BAGUETTES CTF CHALLENGES                     "
    echo "============================================================"
    echo ""
    echo "  Level 1: The Basics"
    echo "  [ ] Find the secret recipe hidden in baker's home"
    echo "  [ ] Read the encoded message from the supplier"
    echo "  [ ] Count how many orders were placed (hint: wc)"
    echo ""
    echo "  Level 2: Investigation"
    echo "  [ ] Find who accessed the system at 3:00 AM"
    echo "  [ ] Identify the IP with the most failed logins"
    echo "  [ ] Extract customer data from the inventory database"
    echo ""
    echo "  Level 3: Advanced"
    echo "  [ ] Find a way to read root's secret file"
    echo "      (hint: look for unusual file permissions)"
    echo "  [ ] Discover what's hidden in the backup archive"
    echo ""
    echo "  Flags are in format: BAGUETTE{...}"
    echo ""
    echo "============================================================"
    echo ""
}

# Challenges list (Finnish)
haasteet() {
    echo ""
    echo "============================================================"
    echo "           LES BAGUETTES CTF-HAASTEET                       "
    echo "============================================================"
    echo ""
    echo "  Taso 1: Perusteet"
    echo "  [ ] Löydä leipurin kotikansioon piilotettu salainen resepti"
    echo "      (vinkki: piilotiedostot alkavat pisteellä, kokeile ls -la)"
    echo "  [ ] Lue tavarantoimittajan koodattu viesti"
    echo "      (vinkki: base64 -d tiedostonimi)"
    echo "  [ ] Laske montako tilausta on tehty (vinkki: wc -l)"
    echo ""
    echo "  Taso 2: Tutkinta"
    echo "  [ ] Selvitä kuka käytti järjestelmää klo 3:00 yöllä"
    echo "      (vinkki: grep '03:' lokitiedostosta)"
    echo "  [ ] Tunnista IP-osoite jolla on eniten epäonnistuneita kirjautumisia"
    echo "      (vinkki: tutki /var/log/ kansiota)"
    echo "  [ ] Poimi asiakastiedot inventaario-tietokannasta"
    echo "      (vinkki: sqlite3 tietokanta.db 'SELECT * FROM taulu;')"
    echo ""
    echo "  Taso 3: Edistynyt"
    echo "  [ ] Löydä tapa lukea rootin salainen tiedosto"
    echo "      (vinkki: etsi tiedostoja joilla on erikoiset oikeudet)"
    echo "  [ ] Selvitä mitä varmuuskopioarkistossa piilee"
    echo "      (vinkki: tar -xzf arkisto.tar.gz)"
    echo ""
    echo "  Liput ovat muodossa: BAGUETTE{...}"
    echo ""
    echo "============================================================"
    echo ""
}

export -f help
export -f apua
export -f challenges
export -f haasteet
