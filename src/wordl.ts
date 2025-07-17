import wordlist from './wordlist-english';

export enum LetterClass {
    Unevaluated,
    NotPresent,
    Misplaced,
    Located   
}

const allDialects = ['english', 'english/british', 'english/american', 'english/canadian'];
const dialects = ['english']; // for choosing the secret word
const freqChoices = [10,20,35,40,50];

/**
 * Return a random english word with the given length.
 * We choose a word with commonality at most '50',
 * and though we require that the word be in the dictionary in
 * lowercase, we return the word in uppercase.
 * @param length 
 * @returns a random english word of the given length
 */
export function randomWord(length : number) : string 
{
    let words: string[] = [];
    for(const f of freqChoices)
    {
        words = [...words, ...wordlist[dialects[0] + '/' + f]];
    }

    function isLower(w: string): boolean
    {
        const newWord = w.toLowerCase();
        return w === newWord;
    }
    const match = words.filter((word) => length === word.length && isLower(word));


    if(match.length < 1) 
    {
        throw new Error("No word of such length"); 
    } 
    
    return match[Math.floor(Math.random() * match.length)].toUpperCase();
}

/**
 * Return whether the word is a lowercase word in the dictionary for any of the
 * dielects supported: standard, British, American or Canadian.
 * @param test word to check
 * @returns true word is accepted by one of our dialects
 */
export function isWord(test : string) : boolean
{
    let words: string[] = [];
    for(const d of allDialects)
    {
        words = [...words, ...wordlist[d]];
    }
    const exists = words.indexOf(test.toLowerCase());
    return exists != -1;
}

/**
 * Compute the classification for this letter in the given position
 * @param letter a single capitalized letter
 * @param position position within the guess (0-based)
 * @param key target word
 * @returns classification of this letter at this position
 */
export function evaluate(letter : string, position : number, key : string) : LetterClass 
{
    if (letter === key.charAt(position)) {
        return LetterClass.Located;
      }
    
    return key.includes(letter) ? LetterClass.Misplaced : LetterClass.NotPresent;
}

/**
 * Evaluate the classification of a letter given all guesses.
 * @param letter a single character
 * @param key the target word
 * @param attempts all previous attempts
 * @returns classification of this letter
 */
export function evaluateLetter(letter : string, key : string, attempts: string []) : LetterClass 
{
    let pos: number = key.indexOf(letter);
    let value: LetterClass = LetterClass.Unevaluated;
    for(const guess of attempts)
    {
        if(!(guess.includes(letter)))
        {
            continue;
        }
        else
        {
            letter == guess.charAt(pos) ? pos : pos = guess.indexOf(letter);  
            const current = evaluate(letter, pos, key);
            if(current > value)
            {
                value = current;
            }
        }
    }
    return value;
}
