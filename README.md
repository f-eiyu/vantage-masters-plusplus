# Vantage Masters++
Vantage Masters is a collectible card minigame in the latter half of the Trails
of Cold Steel series of JRPGs. The card minigame is an homage to Vantage Master,
an earlier work by the same developer (which I have not actually played). I'm a
massive fan of the Trails universe (it's probably my favorite media ever) and
had a lot of fun playing Vantage Masters, so I figured I would try my hand at
re-creating it, at a baseline, and maybe even adding some cool new stuff to it
(hence the ++)!

## User stories
### MVP goals
- Play the Vantage Masters card game against the computer.
    - This is a turn-based card game based on summoning monsters known as natials
    to the board to attack the opponent's deck master.
    - On each turn, players draw one card from their deck. Then, players can
    summon natials from their hand, play spell cards, move the natials on their
    board, attack with the natials on their board, or use a natial special ability.
    - The natial zone has two rows. Natials in the back row cannot attack, unless
    they have the "ranged" flag. Natials in the front row cannot attack natials
    in the opposing back row if there are natials in the opposing front row, unless
    the attacker has the "ranged" flag.
    - Natials cannot take any action on the turn they're summoned, unless they
    have the "quick" flag.
    - The deck master is automatically placed on the back row of the natial zone
    at the start of the game, and behaves like a natial in all respects except two:
        1. A player will immediately lose the game if the deck master's HP is zero.
        2. A deck master's special ability (if it has one) costs mana and can be
        used once per turn instead of one time only.
    - Each player starts with an amount of mana specified by their deck master
    and automatically gains one maximum mana every turn.
        - Mana increases from spells or effects will not increase maximum mana,
        but can allow mana to temporarily exceed the current maximum.
    - Natial summoning and spell usage are both gated by mana.
    - Mana refills to the current maximum at the start of every turn.
    - The first player to move is random; the second player to move gains a
    small amount of a compensatory resource.
    - The first player to reduce the opposing deck master's HP to zero is the winner.
    - The computer opponent will summon natials to the board and attack with them.

### Stretch goals
- Play Vantage Masters with all of the cards that exist in Trails of Cold Steel IV.
- Play Vantage Masters against a smarter computer.
    - The computer will have some more sophisticated behavior, such as trying to
    maintain board control, saving spell cards for a "lethal", or focusing down
    the player's deck master exclusively.
- Build custom decks to play the game with.
    - The deck builder tool can be used to customize and craft decks with any
    combination of natials, spells, and masters.
    - Decks are composed of one deck master plus any twenty cards.
    - Each (non-master) card can be chosen at most three times.
    - Decks should be able to be named and saved locally for later retrieval.
- Choose from a variety of opponents to play the game against.
    - Opponents should feature decks of differing quality, strategy, and difficulty.

## Hypothetical workflow, roughly in order
1. Create a wireframe of the game board, a few debug cards, and a debug deck.
2. Implement (for the player) placing a natial on the board from the hand,
moving natials around friendly board zones, and attacking enemy natials.
3. Implement the framework for a turn. A turn starts with drawing one card from
the deck, then any combination of summoning, attacking, and movement. Turns end
when the "End Turn" button is clicked.
4. Implement a basic "AI" that simply summons as many cards as possible and attacks
with as many cards as possible on its turn.
5. Implement the back-and-forth between player turns and enemy turns, with the
first turn-taker being random.
6. Create a framework for spell card functionality via callbacks and create two
straightforward spells to debug with.
7. Create a framework for card active ability functionality via callbacks and
create two straightforward active effects to debug with.
8. Implement victory and loss conditions.
9. **At this stage, the core gameplay features are fully functional and I will
have a Vantage Masters MVP. Anything after this step is considered a stretch goal.**
10. Create a wireframe of the deck builder, game start screen, and title screen.
11. Implement the deck builder, which lets the player choose cards to form their
deck with and save a list of decks in local storage for long term replayability.
12. Create a framework for having discrete opponents with discrete decks and
create two opponent decks to debug with.
13. Implement the game start screen, which allows players to choose their deck
and opponent.
14. Implement the title screen, which simply links to the deck builder and
the game start screen.
15. Implement all the cards that exist in Trails of Cold Steel IV's Vantage
Masters II minigame.
16. Improve the aesthetics of every page to look like a game instead of a bunch
of wireframes.
17. Any extras that I have time to finish will go here: more computer opponents,
more advanced AI scripts, a game tutorial, a "progress mode" where beating each
opponent for the first time unlocks a card for the deck, new cards and mechanics
of my own design, etc.

## Wireframes
MVP: board and card wireframes
![Fei's board and card wireframes](./wireframes/mvp-game-board-and-card.jpeg)

Stretch: deck builder and title screen
![Fei's deck builder and title screen wireframes](./wireframes/deck-builder-and-title.jpeg)

Stretch: game start options
![Fei's game start screen wireframe](./wireframes/game-start.jpeg)