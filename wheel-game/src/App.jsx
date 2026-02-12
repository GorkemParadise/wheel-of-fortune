import { useState, useCallback, useRef, useEffect } from "react";

const WHEEL_SEGMENTS = [
  { label: "100", value: 100, type: "money", color: "#E74C3C" },
  { label: "200", value: 200, type: "money", color: "#3498DB" },
  { label: "300", value: 300, type: "money", color: "#2ECC71" },
  { label: "400", value: 400, type: "money", color: "#F39C12" },
  { label: "500", value: 500, type: "money", color: "#9B59B6" },
  { label: "600", value: 600, type: "money", color: "#1ABC9C" },
  { label: "700", value: 700, type: "money", color: "#E67E22" },
  { label: "800", value: 800, type: "money", color: "#2980B9" },
  { label: "900", value: 900, type: "money", color: "#27AE60" },
  { label: "1000", value: 1000, type: "money", color: "#F1C40F" },
  { label: "1500", value: 1500, type: "money", color: "#E74C3C" },
  { label: "2000", value: 2000, type: "money", color: "#8E44AD" },
  { label: "2500", value: 2500, type: "money", color: "#16A085" },
  { label: "3000", value: 3000, type: "money", color: "#D4AC0D" },
  { label: "5000", value: 5000, type: "money", color: "#2C3E50" },
  { label: "BANKRUPT", value: 0, type: "bankrupt", color: "#1C1C1C" },
  { label: "BANKRUPT", value: 0, type: "bankrupt", color: "#1C1C1C" },
  { label: "LOSE TURN", value: 0, type: "lose_turn", color: "#7F8C8D" },
];

const VOWELS = ["A", "E", "I", "O", "U"];
const VOWEL_COST = 250;
const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ".split("");
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG_GUESSES = 6;

// ============================================================
// FILE: /data/words.ts — 100 words per level, 10 levels
// ============================================================

const WORDS_BY_LEVEL = {
  1: [
    "ARRAY","CACHE","CLASS","DEBUG","FETCH","GRAPH","INDEX","LINUX","MOUSE","PATCH",
    "PIXEL","QUERY","QUEUE","STACK","TOKEN","VIRUS","BLOCK","BYTES","CHAIN","CLOUD",
    "CRYPT","CYCLE","DRIVE","ERROR","EVENT","FLOAT","FRAME","GLYPH","HEAPS","INPUT",
    "LABEL","LAYER","MATCH","MERGE","MOUNT","NODES","PARSE","PIVOT","POINT","PORTS",
    "PRINT","PROXY","RANGE","REACT","REDIS","REGEX","RESET","ROUTE","SCALA","SCOPE",
    "SHELL","SHIFT","SLEEP","SLICE","SPACE","SPAWN","STATE","STORE","STYLE","SWIFT",
    "TABLE","THEME","TIMER","TOTAL","TRACE","TRAIN","TREES","TUPLE","TYPES","UNION",
    "UTILS","VALUE","VIDEO","VIEWS","WATCH","WHEEL","WIDTH","WHILE","WRITE","YIELD",
    "ABORT","ALIGN","ALPHA","BATCH","BENCH","BOOST","BOUND","BUILD","CHARS","CHECK",
    "CLONE","COLOR","COUNT","CRASH","DATUM","DEPTH","DRAFT","EJECT","EMBED","EMPTY"
  ],
  2: [
    "BINARY","BITMAP","BORDER","BRANCH","BRIDGE","BROKER","BUCKET","BUFFER","BUTTON","COLUMN",
    "COMMIT","CURSOR","DAEMON","DECODE","DELETE","DEPLOY","DESIGN","DEVICE","DIGEST","DOCKER",
    "DOMAIN","DRIVER","EDITOR","ELIXIR","ENCODE","ENGINE","ENTITY","EXPORT","FABRIC","FILTER",
    "FOLDER","FORMAT","GITHUB","GLOBAL","GOLANG","GRADLE","HANDLE","HEADER","HEROKU","HOPPER",
    "IMPORT","INSERT","KERNEL","LAMBDA","LAYOUT","LENGTH","LINKED","LISTEN","LOADER","LOOKUP",
    "MAPPER","MARKUP","MASTER","MATRIX","MEMBER","MEMORY","METHOD","METRIC","MOBILE","MODULE",
    "MUTATE","NEURAL","OBJECT","OFFSET","OPTION","OUTPUT","PACKET","PADDLE","PARSER","PLUGIN",
    "POLICY","PREFIX","RENDER","REPEAT","RETURN","ROUTER","RUBIKS","RUNNER","RUNTIM","SAMPLE",
    "SCALAR","SCHEMA","SCRIPT","SCROLL","SEARCH","SECRET","SELECT","SENDER","SERVER","SHADOW",
    "SIGNAL","SINGLE","SOCKET","SOURCE","SPLICE","SPRING","SPRITE","SQUARE","STREAM","STRING"
  ],
  3: [
    "ABSTACT","ADAPTER","ANGULAR","ARCHIVE","BACKEND","BINDING","BOOLEAN","BUILDER","CACHING","CAPTURE",
    "CATALOG","CHANNEL","CIRCUIT","CLUSTER","COLLECT","COMMAND","COMPARE","COMPILE","COMPLEX","COMPUTE",
    "CONCEPT","CONFIRM","CONNECT","CONSOLE","CONTENT","CONTEXT","CONTROL","CONVERT","COUNTER","CRAWLER",
    "CREATOR","DATASET","DEFAULT","DECRYPT","DELIVER","DESKTOP","DEVICED","DIGITAL","DISPLAY","DISPOSE",
    "DYNAMIC","ELEMENT","EMANATE","EMITTER","ENABLED","ENCRYPT","ENVIRON","EXECUTE","EXPLOIT","EXPRESS",
    "EXTRACT","FACTORY","FEATURE","FETCHAI","FIREFOX","FLATTEN","FLUTTER","FORWARD","GATEWAY","HANDLER",
    "HASHING","HOSTING","HUFFMAN","INTEGER","ITERATE","JUPYTER","KEYWORD","LANDING","LIBRARY","LINKING",
    "LISTING","LOGGING","MACHINE","MANAGER","MAPPING","MARSHAL","MESSAGE","MIGRATE","MINHEAP","MONITOR",
    "NATURAL","NETWORK","NOTHING","OPERATE","PACKAGE","PADDING","PALETTE","PATTERN","PAYLOAD","PHYSICS",
    "POINTER","POLYGON","PREVIEW","PRINTER","PROCESS","PRODUCT","PROFILE","PROGRAM","PROJECT","PROMISE"
  ],
  4: [
    "ABSTRACT","ACTUATOR","AGNOSTIC","ALLOCATE","ANALYSIS","ANIMATED","ASSEMBLY","BACKTICK","BALANCED","BASELINE",
    "CALLBACK","CASCADER","CATEGORY","CHECKSUM","CIPHERYA","CLASSFUL","CLIMBING","CLOSURES","CODEBASE","COMPILER",
    "COMPRESS","CONFLICT","CONSUMER","CONVERGE","COVERAGE","CRITICAL","DATABASE","DEADLOCK","DEBUGGER","DECIMATE",
    "DECORATE","DELEGATE","DEPARSER","DIGITIZE","DISPATCH","DISPOSED","DISTANCE","DIVIDING","DOCUMENT","DOWNLOAD",
    "DROPDOWN","EMBEDDED","EMITTING","ENCODING","ENDPOINT","ENSEMBLE","ENVELOPE","ETHEREAL","EVALUATE","EXECUTOR",
    "EXPONENT","EXTERNAL","FACEBOOK","FALLBACK","FEEDBACK","FILEPATH","FIREBASE","FIRMWARE","FLAGGING","FLOATING",
    "FOLLOWER","FRACTION","FRAGMENT","FRONTEND","FUNCTION","GENERATE","GRADIENT","GRAPHICS","HANDLING","HARDWARE",
    "HASHCODE","HEADLESS","HOMEPAGE","HOSTNAME","HYPERMAP","IDENTITY","IMPLICIT","IMPORTER","INDEXING","INFINITE",
    "INSTANCE","INTEGRAL","INTERNAL","INTERVAL","ITERATOR","KEYBOARD","LANGUAGE","LISTNODE","LISTENER","LOCATION",
    "LOGISTIC","LONGPOLL","MANIFEST","MARKDOWN","MEMBRANE","METADATA","MINIMIZE","MODIFIER","MODELING","MUTATION"
  ],
  5: [
    "AGGREGATE","ALGORITHM","ALLOCATOR","ANIMATION","ANNOTATED","ANONYMOUS","APPLIANCE","ARCHITECT","ASSEMBLER","ASYMPOTIC",
    "ATTRIBUTE","AUTHENTIC","AUTOMATON","BACKTRACK","BANDWIDTH","BENCHMARK","BILATERAL","BIOMETRIC","BLACKLIST","BOOTSTRAP",
    "BROADCAST","BUFFERING","CANONICAL","CANDIDATE","CATALYTIC","CHANGELOG","CHARACTER","CLASSLESS","CLICKABLE","COALESCED",
    "COGNITION","COLLISION","COMMUNITY","COMPONENT","COMPUTING","CONDITION","CONFIGURE","CONNECTED","CONSTRUCT","CONTAINER",
    "CONVOLUTE","COPYRIGHT","DASHBOARD","DATAMINER","DEBUGGING","DECRYPTER","DECORATOR","DEDUCTION","DEPENDING","DETECTIVE",
    "DEVELOPER","DIFFUSION","DIMENSION","DIRECTORY","DISCOVERY","DITHERING","DOWNGRADE","ECOSYSTEM","EFFICIENT","ELABORATE",
    "ELEVATION","ELIMINATE","EMBEDDING","EMULATION","ENCRYPTED","EXCEPTION","EXECUTION","EXPANSION","EXTENSION","FACTORING",
    "FIBONACCI","FILTERING","FIREWALLS","FLATTENED","FORMATTER","FRAMEWORK","FREQUENCY","FULLSTACK","GENERATOR","GEOMETRIC",
    "GRADIENTS","GRAPHICAL","GUARANTEE","GUIDELINE","HANDSHAKE","HASHINDEX","HIGHLIGHT","HISTOGRAM","HYPERLINK","IDEMPOTEN",
    "IMAGINARY","IMMUTABLE","IMPLEMENT","INCREMENT","INFERENCE","INJECTION","INMEMORIA","INPUTDATA","INSPECTOR","INSTALLER"
  ],
  6: [
    "ABSTRACTION","ACCELERATE","ACCESSIBILITY","ACCUMULATE","ACKNOWLEDGE","AGENTTENSOR","ALTERNATIVE","APPLICATION","APPROXIMATE","ASSOCIATION",
    "ASYNCHRONOUS","AUTHENTICATE","AUTOENCODER","BACKPROPGATE","BIDIRECTIONAL","BREADTHFIRST","CACHECOHERENT","CALLBACKHELL","CIPHERSTREAM","CLASSIFIABLE",
    "CODEREVIEW","COMPILATION","COMPRESSION","CONCURRENCY","CONDITIONAL","CONSTRUCTOR","CONTAINERIZE","CONVOLUTION","CROSSORIGIN","CYBERNETICS",
    "DATAPIPELINE","DECOMPILERS","DEFORMATION","DEPRECATED","DESERIALIZE","DETERMINISTIC","DIAGNOSTICS","DISTRIBUTED","EIGENVALUES","ELIMINATION",
    "ENCAPSULATE","ENVIRONMENT","EVOLUTIONARY","EXPONENTIAL","FABRICATION","FEATUREFLAGS","FILEHANDLING","FINGERPRINT","FORECASTING","FULLMESHGRID",
    "GARBAGECOLLECT","GENERALIZED","GEOREPLICATE","HASHFUNCTION","HYPERVISOR","IDEMPOTENCY","IMPLICATION","INCREMENTAL","INFORMATION","INHERITANCE",
    "INITIALIZER","INTELLIGENT","INTERCEPTOR","INTERPRETER","INVALIDATOR","ITERTOOLSPY","JSONPARSING","KERNELOBJECT","KUBERENTRIES","LEADERBOARD",
    "LINEARMODEL","LOADBALANCE","LOCALIZATION","LOGANALYSIS","LOSSFUNCTION","MACHINELEARN","MALWARECHECK","MANUFACTURING","MEMORYALLOC","MICROKERNEL",
    "MICROSERVICE","MULTITHREAD","NAMERESOLVER","NATURALLANG","NETWORKSTACK","NORMALIZTION","OBSERVERNODE","OPTIMIZATION","ORCHESTRATOR","OUTPUTSTREAM",
    "PARALLELISM","PATHFINDING","PERFORMANCE","PERSISTENCE","POLYMORPHISM","PROBABILITY","PROVISIONER","QUERYENGINE","REACTIVEPROG","RECOGNITION"
  ],
  7: [
    "NEURAL NETWORK","DEEP LEARNING","DATA SCIENCE","LINKED LIST","BINARY TREE","HASH TABLE","STACK TRACE","THREAD POOL","CODE REVIEW","UNIT TESTS",
    "LOAD BALANCE","FILE SYSTEM","DISK SPACE","BYTE STREAM","BASE CLASS","INNER JOIN","LEFT MERGE","FULL OUTER","TYPE CHECK","NULL VALUE",
    "RACE CONDITION","PROXY SERVER","CACHE LAYER","QUEUE SYSTEM","HEAP MEMORY","TEXT MINING","DATA FRAME","CLOUD NATIVE","OPEN SOURCE","EDGE DEVICE",
    "HIGH LEVEL","MULTI CORE","CROSS SITE","REAL TIME","BATCH MODE","GRID LAYOUT","DROP TABLE","LIVE PATCH","COLD START","WARM CACHE",
    "HARD FAULT","SOFT RESET","LOCK STATE","FORK MERGE","PULL IMAGE","PUSH EVENT","FIRE ALARM","SAFE MODE","DARK THEME","LIGHT MODE",
    "CORE LOGIC","PURE REACT","NODE GRAPH","ENTRY POINT","ERROR BOUND","STATE HOOK","SIDE CHAIN","SMART MATCH","QUICK SORT","MERGE SORT",
    "FLAT INDEX","LONG QUERY","BLIND SCAN","RANGE LOCK","TASK QUEUE","ROUND TRIP","SPIN WHEEL","GAME BOARD","USER INPUT","KEY PRESS",
    "NEXT TOKEN","CLIP MODEL","WORD EMBED","HIGH SCORE","MISS COUNT","TURN ORDER","FONT GLYPH","DRAW FRAME","MAIN LOOP","INIT CALL",
    "RATE LIMIT","LOAD SHARD","FAIL OVER","RING MESH","PATH ROUTE","LINK TABLE","FLOW CHART","PRIME HASH","CODE BLOCK","PAGE FAULT",
    "NAME SPACE","TYPE ALIAS","READ WRITE","SWAP SPACE","BOOT IMAGE","YIELD CALL","ASYNC TASK","BATCH NORM","LOSS GRAPH","BEAM WIDTH"
  ],
  8: [
    "MACHINE LEARNING","BINARY SEARCH TREE","DEPTH FIRST SEARCH","OBJECT DETECTION","IMAGE CLASSIFIER","GRADIENT DESCENT","RANDOM FOREST","SUPPORT VECTOR",
    "FEATURE EXTRACT","LANGUAGE MODEL","TRAINING DATASET","SEMANTIC SEARCH","TOKEN EMBEDDING","ATTENTION LAYER","CONTEXT WINDOW","PROMPT ENGINEER",
    "NATURAL LANGUAGE","COMPUTER VISION","SPEECH SYNTH","VOICE CLONING","FACIAL DETECT","MOTION CAPTURE","EDGE COMPUTING","CLOUD PLATFORM",
    "MICRO SERVICE","CONTAINER IMAGE","CLUSTER DEPLOY","REPLICA FACTOR","NETWORK POLICY","ACCESS CONTROL","SECURE SOCKET","CIPHER STREAM",
    "PUBLIC CRYPTO","PRIVATE SHARD","CONSENSUS NODE","MINING REWARD","SMART CONTRACT","TOKEN BRIDGE","DIGITAL WALLET","BLOCK CONFIRM",
    "CHAIN REORG","MEMORY BUFFER","HEAP OVERFLOW","STACK POINTER","CACHE INVALIDATE","VIRTUAL MEMORY","CONTEXT SWITCH","THREAD SAFETY",
    "MUTEX HANDLER","SIGNAL PROCESS","SYSTEM DAEMON","KERNEL MODULE","DEVICE DRIVER","INTERRUPT TABLE","MEMORY MAPPED","PROCESS SPAWN",
    "SOCKET LISTEN","PORT FORWARD","PACKET FILTER","BRIDGE NETWORK","ROUTING TABLE","DOMAIN RESOLVE","PROXY HANDLER","STREAM CIPHER",
    "BLOCK PADDING","DIGEST VERIFY","SIGNING VERIFY","TRUST ANCHOR","REVOKE ISSUER","CERTIFY CHAIN","RENEWAL CYCLE","AUDIT LOGGING",
    "TRACE CONTEXT","METRIC EXPORT","LOG PIPELINE","ALERT MANAGER","HEALTH PROBING","CANARY DEPLOY","ROLLBACK PATCH","CHAOS TESTING",
    "FUZZY TESTING","STRESS LOADER","BENCH HARNESS","PROFILE SAMPLE","FLAME CAPTURE","HEAP SNAPSHOT","CORE ANALYSIS","DEBUG ADAPTER",
    "BREAK INSPECT","WATCH EXPRESS","FRAME POINTER","SCOPE RESOLVE","SYMBOL LOOKUP","LINKER SCRIPT","OBJECT FORMAT","RELOCATION FIX",
    "DYNAMIC LINK","STATIC BINARY","CROSS COMPILE","TARGET TRIPLE"
  ],
  9: [
    "ARTIFICIAL INTELLIGENCE","CONVOLUTIONAL NETWORK","RECURRENT NEURAL NET","TRANSFORMER ENCODER","GENERATIVE ADVERSARY",
    "REINFORCEMENT LEARN","BACKPROPAGATION ALGO","STOCHASTIC GRADIENT","PRINCIPAL COMPONENT","SINGULAR DECOMPOSE",
    "DISTRIBUTED COMPUTE","PARALLEL PROCESSING","CONCURRENT THREADS","ASYNCHRONOUS CHANNEL","BIDIRECTIONAL STREAM",
    "MICROSERVICE GATEWAY","CONTAINER ORCHESTRA","KUBERNETES OPERATOR","INFRASTRUCTURE CODE","CONTINUOUS DELIVERY",
    "INTEGRATION TESTING","REGRESSION ANALYSIS","ACCEPTANCE CRITERIA","FUNCTIONAL PROGRAM","DECLARATIVE SYNTAX",
    "IMPERATIVE LANGUAGE","ABSTRACTION PATTERN","DESIGN METHODOLOGY","COMPOSITE STRUCTURE","DEPENDENCY INJECTOR",
    "OBSERVER PUBLISHER","STRATEGY ALGORITHM","TEMPLATE PROCESSOR","FLYWEIGHT INSTANCE","MEDIATOR COMPONENT",
    "COMMAND DISPATCHER","INTERPRETER PARSER","PROTOTYPE INSTANCE","SINGLETON REGISTRY","ADAPTER INTERFACE",
    "BRIDGE ABSTRACTION","DECORATOR ENHANCER","PROXY INTERCEPTOR","FACADE SIMPLIFIER","ITERATOR TRAVERSE",
    "CHAIN RESPONSIBLE","STATE TRANSITION","MEMENTO SNAPSHOT","VISITOR OPERATION","BINARY CLASSIFIER",
    "MULTILABEL OUTPUT","SEQUENCE ALIGNMENT","DYNAMIC PROGRAM","GREEDY ALGORITHM","DIVIDE AND CONQUER",
    "BREADTH FIRST PATH","MINIMUM SPANNING","SHORTEST PATH FIND","TOPOLOGICAL SORTER","STRONGLY CONNECTED",
    "SEGMENT TREE BUILD","FENWICK STRUCTURE","SUFFIX AUTOMATON","PERSISTENT VECTOR","BALANCED PARTITION",
    "BLOOM FILTER CHECK","CUCKOO HASH TABLE","CONSISTENT HASHING","MERKLE PROOF CHAIN","BYZANTINE TOLERANT",
    "CONSENSUS PROTOCOL","VECTOR SIMILARITY","EMBEDDING RETRIEVAL","ATTENTION MECHANISM","POSITIONAL ENCODING",
    "TOKENIZER TRAINING","BEAM SEARCH DECODE","NUCLEUS SAMPLING","TEMPERATURE SCALING","KNOWLEDGE DISTILL",
    "QUANTIZE INFERENCE","MODEL COMPRESSION","PRUNING OPTIMIZER","FEDERATED LEARNING","DIFFERENTIAL PRIVACY",
    "SECURE AGGREGATION","HOMOMORPHIC ENCRYPT","ZERO KNOWLEDGE PROOF","TRUSTED EXECUTION","ENCLAVE ISOLATION",
    "ATTESTATION SERVICE","REMOTE MEASUREMENT","HARDWARE SECURITY","FIRMWARE VALIDATOR","TRUSTED PLATFORM",
    "MEASURED BOOT CHAIN","REVOCATION ENDPOINT","CERTIFICATE ROTATE","IDENTITY PROVISION","CREDENTIAL MANAGE",
    "TOKEN INTROSPECTOR","REFRESH GRANT FLOW","SCOPE NEGOTIATION","RESOURCE INDICATOR","PUSHED AUTHORIZE",
    "DEMONSTRATING PROOF","SELECTIVE DISCLAIM","STATUS ASSERTION","VERIFIABLE PRESENT","DECENTRALIZE IDENT"
  ],
  10: [
    "LARGE LANGUAGE MODEL TRAINING","RETRIEVAL AUGMENTED GENERATION","CHAIN OF THOUGHT REASONING","REINFORCEMENT LEARNING HUMAN",
    "MIXTURE OF EXPERTS ROUTING","SPARSE ATTENTION MECHANISM","FLASH ATTENTION ALGORITHM","GROUPED QUERY ATTENTION",
    "ROTARY POSITION EMBEDDING","KNOWLEDGE GRAPH COMPLETION","SEMANTIC SIMILARITY SEARCH","APPROXIMATE NEAREST NEIGHBOR",
    "HIERARCHICAL NAVIGABLE GRAPH","INVERTED FILE FLAT INDEX","PRODUCT QUANTIZATION SEARCH","LOCALITY SENSITIVE HASHING",
    "DISTRIBUTED GRADIENT DESCENT","FEDERATED AVERAGING METHOD","ASYNCHRONOUS PARALLEL TRAIN","DATA PARALLEL STRATEGY",
    "MODEL PARALLEL PIPELINE","TENSOR PARALLEL SHARDING","ZERO REDUNDANCY OPTIMIZER","GRADIENT CHECKPOINT METHOD",
    "MIXED PRECISION TRAINING","AUTOMATIC DIFFERENTIATION","COMPUTATION GRAPH OPTIMIZE","JUST IN TIME COMPILATION",
    "AHEAD OF TIME COMPILER","INTERMEDIATE REPRESENT CODE","STATIC SINGLE ASSIGNMENT","CONTROL FLOW GRAPH ANALYZE",
    "DOMINATOR TREE CONSTRUCT","LOOP INVARIANT CODE MOTION","DEAD CODE ELIMINATION PASS","CONSTANT PROPAGATION FOLD",
    "STRENGTH REDUCTION METHOD","REGISTER ALLOCATION COLOR","INSTRUCTION SCHEDULING PASS","BRANCH PREDICTION OPTIMIZE",
    "SPECULATIVE EXECUTION PATH","CACHE COHERENCE PROTOCOL","MEMORY CONSISTENCY MODEL","SEQUENTIAL CONSISTENCY CHECK",
    "TOTAL STORE ORDER ENFORCE","RELEASE ACQUIRE SEMANTIC","COMPARE AND SWAP ATOMIC","LOAD LINKED STORE COND",
    "MEMORY BARRIER FENCE SYNC","HARDWARE TRANSACTIONAL MEM","SOFTWARE TRANSACTIONAL MEM","OPTIMISTIC CONCURRENCY CTL",
    "PESSIMISTIC LOCK STRATEGY","MULTIVERSION CONCUR CTRL","SNAPSHOT ISOLATION LEVEL","SERIALIZABLE ISOLATION LVL",
    "READ COMMITTED ISOLATION","WRITE AHEAD LOG PROTOCOL","ARIES RECOVERY ALGORITHM","SHADOW PAGING TECHNIQUE",
    "FUZZY CHECKPOINT PROTOCOL","LOG STRUCTURED MERGE TREE","BLOOM FILTER OPTIMIZATION","COMPACTION STRATEGY LEVEL",
    "SIZE TIERED COMPACTION","LEVELED COMPACTION METHOD","UNIVERSAL COMPACTION PLAN","FIFO COMPACTION STRATEGY",
    "TIME WINDOW COMPACTION","CONSENSUS ALGORITHM RAFT","BYZANTINE FAULT TOLERANT","PRACTICAL BYZANTINE FAULT",
    "VIEWSTAMPED REPLICATION","MULTI PAXOS CONSENSUS","FLEXIBLE PAXOS PROTOCOL","HOTSTUFF CONSENSUS CHAIN",
    "TENDERMINT CORE PROTOCOL","DELEGATED PROOF OF STAKE","NOMINATED PROOF OF STAKE","VERIFIABLE RANDOM FUNCTION",
    "THRESHOLD SIGNATURE SCHEME","SHAMIR SECRET SHARE SPLIT","MULTIPARTY COMPUTATION SEC","GARBLED CIRCUIT PROTOCOL",
    "OBLIVIOUS TRANSFER METHOD","PRIVATE INFORMATION PULL","SECURE FUNCTION EVALUATE","TRUSTED SETUP CEREMONY",
    "POWERS OF TAU PROTOCOL","UNIVERSAL REFERENCE STRING","STRUCTURED REFERENCE STR","KATE POLYNOMIAL COMMIT",
    "INNER PRODUCT ARGUMENT","BULLETPROOF RANGE PROOF","RECURSIVE PROOF COMPOSE","INCREMENTALLY VERIFIABLE",
    "SUCCINCT NON INTERACTIVE","ZERO KNOWLEDGE SUCCINCT","GROTH SIXTEEN PROOF SYS","PLONK PROOF SYSTEM IMPL",
    "SONIC UNIVERSAL SETUP","MARLIN PREPROCESSING ZK","FRACTAL RECURSIVE PROOF","HALO ACCUMULATION SCHEME",
    "NOVA FOLDING SCHEME IVC","SUPERNOVA FOLDING EXTEND","HYPERNOVA CUSTOM SCHEME","PROTOGALAXY FOLD VARIANT"
  ],
};

// ============================================================
// FILE: /utils/helpers.ts
// ============================================================

function getRandomWord(level) {
  const words = WORDS_BY_LEVEL[level];
  if (!words || words.length === 0) return "ALGORITHM";
  return words[Math.floor(Math.random() * words.length)];
}

function isVowel(letter) {
  return VOWELS.includes(letter.toUpperCase());
}

function getUniqueLetters(word) {
  const letters = new Set();
  for (const ch of word.toUpperCase()) {
    if (ch !== " ") letters.add(ch);
  }
  return letters;
}

function countLetterInWord(word, letter) {
  let count = 0;
  for (const ch of word.toUpperCase()) {
    if (ch === letter.toUpperCase()) count++;
  }
  return count;
}

function isWordSolved(word, guessedLetters) {
  for (const ch of word.toUpperCase()) {
    if (ch === " ") continue;
    if (!guessedLetters.has(ch)) return false;
  }
  return true;
}

function getWeightedRandomSegment() {
  const weights = WHEEL_SEGMENTS.map((seg) => {
    if (seg.type === "bankrupt") return 2;
    if (seg.type === "lose_turn") return 2;
    if (seg.value >= 2000) return 1;
    if (seg.value >= 1000) return 2;
    return 3;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return i;
  }
  return 0;
}

// ============================================================
// FILE: /hooks/useWheel.ts
// ============================================================

function useWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const animFrameRef = useRef(null);
  const angleRef = useRef(0);

  const spin = useCallback(() => {
    return new Promise((resolve) => {
      if (isSpinning) return;

      const resultIndex = getWeightedRandomSegment();
      const segment = WHEEL_SEGMENTS[resultIndex];
      setSelectedSegment(segment);

      const segmentAngle = 360 / WHEEL_SEGMENTS.length;
      const targetSegmentCenter = resultIndex * segmentAngle + segmentAngle / 2;
      const extraRotations = 5 * 360;
      const finalAngle = extraRotations + (360 - targetSegmentCenter);

      setIsSpinning(true);
      const startAngle = angleRef.current % 360;
      const totalSpin = finalAngle;
      const duration = 4000;
      const startTime = performance.now();

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const newAngle = startAngle + totalSpin * easedProgress;

        angleRef.current = newAngle;
        setCurrentAngle(newAngle);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);
          resolve(segment);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    });
  }, [isSpinning]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return { isSpinning, currentAngle, selectedSegment, spin };
}

// ============================================================
// FILE: /hooks/useGame.ts
// ============================================================

function useGame() {
  const [level, setLevel] = useState(1);
  const [currentWord, setCurrentWord] = useState(() => getRandomWord(1));
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [currentSpinValue, setCurrentSpinValue] = useState(0);
  const [gamePhase, setGamePhase] = useState("spinning");
  const [message, setMessage] = useState("Spin the wheel to start!");
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [consecutiveWins, setConsecutiveWins] = useState(0);

  const handleSpinResult = useCallback(
    (segment) => {
      if (segment.type === "bankrupt") {
        setRoundScore(0);
        setMessage("BANKRUPT! You lost your round earnings! Spin again.");
        setGamePhase("spinning");
        return;
      }
      if (segment.type === "lose_turn") {
        setWrongGuesses((prev) => {
          const next = prev + 1;
          if (next >= MAX_WRONG_GUESSES) {
            setGameOver(true);
            setWon(false);
            setTotalLosses((l) => l + 1);
            setConsecutiveWins(0);
            setMessage(`Game Over! The word was: ${currentWord}`);
          } else {
            setMessage(`Lost a turn! (${next}/${MAX_WRONG_GUESSES} strikes) Spin again.`);
          }
          return next;
        });
        setGamePhase("spinning");
        return;
      }
      setCurrentSpinValue(segment.value);
      setGamePhase("guessing");
      setMessage(`$${segment.value}! Pick a consonant.`);
    },
    [currentWord]
  );

  const guessLetter = useCallback(
    (letter) => {
      const upperLetter = letter.toUpperCase();
      if (guessedLetters.has(upperLetter)) return;
      if (gameOver) return;

      const newGuessed = new Set(guessedLetters);
      newGuessed.add(upperLetter);
      setGuessedLetters(newGuessed);

      const isInWord = currentWord.toUpperCase().includes(upperLetter);
      const isVowelGuess = isVowel(upperLetter);

      if (isVowelGuess) {
        if (roundScore < VOWEL_COST && score < VOWEL_COST) {
          setMessage(`Not enough money to buy a vowel ($${VOWEL_COST} needed). Pick a consonant or spin.`);
          newGuessed.delete(upperLetter);
          setGuessedLetters(new Set(newGuessed));
          return;
        }
        if (roundScore >= VOWEL_COST) {
          setRoundScore((s) => s - VOWEL_COST);
        } else {
          setScore((s) => s - VOWEL_COST);
        }
      }

      if (isInWord) {
        const count = countLetterInWord(currentWord, upperLetter);
        if (!isVowelGuess) {
          setRoundScore((s) => s + currentSpinValue * count);
        }
        setMessage(
          `${upperLetter} is in the word! ${count > 1 ? `(${count} times!)` : ""} ${
            isVowelGuess ? "" : "Spin again or buy a vowel."
          }`
        );

        if (isWordSolved(currentWord, newGuessed)) {
          const bonus = level * 500;
          const total = roundScore + (isVowelGuess ? 0 : currentSpinValue * count) + bonus;
          setScore((s) => s + total);
          setRoundScore(0);
          setWordsCompleted((w) => w + 1);
          setConsecutiveWins((c) => c + 1);

          if (level >= 10) {
            setGameOver(true);
            setWon(true);
            setTotalWins((w) => w + 1);
            setMessage(`🏆 CHAMPION! You completed all 10 levels! Final score: $${score + total}`);
          } else {
            setTotalWins((w) => w + 1);
            setMessage(`🎉 Correct! "${currentWord}" — Level bonus: $${bonus}! Moving to level ${level + 1}...`);
            setTimeout(() => {
              const nextLevel = level + 1;
              setLevel(nextLevel);
              const nextWord = getRandomWord(nextLevel);
              setCurrentWord(nextWord);
              setGuessedLetters(new Set());
              setWrongGuesses(0);
              setCurrentSpinValue(0);
              setGamePhase("spinning");
              setMessage(`Level ${nextLevel}! Spin the wheel.`);
            }, 2500);
          }
          setGamePhase("won_round");
          return;
        }
        setGamePhase("spinning");
      } else {
        setWrongGuesses((prev) => {
          const next = prev + 1;
          if (next >= MAX_WRONG_GUESSES) {
            setGameOver(true);
            setWon(false);
            setTotalLosses((l) => l + 1);
            setConsecutiveWins(0);
            setMessage(`Game Over! The word was: "${currentWord}"`);
            setGamePhase("game_over");
          } else {
            setMessage(`${upperLetter} is not in the word. (${next}/${MAX_WRONG_GUESSES} strikes) Spin again.`);
            setGamePhase("spinning");
          }
          return next;
        });
      }
    },
    [guessedLetters, currentWord, currentSpinValue, roundScore, score, level, gameOver]
  );

  const buyVowel = useCallback(() => {
    if (gameOver) return;
    const canAfford = roundScore >= VOWEL_COST || score >= VOWEL_COST;
    if (!canAfford) {
      setMessage(`Need $${VOWEL_COST} to buy a vowel!`);
      return;
    }
    setGamePhase("buying_vowel");
    setMessage(`Buy a vowel ($${VOWEL_COST}). Pick: A, E, I, O, or U.`);
  }, [roundScore, score, gameOver]);

  const resetGame = useCallback(() => {
    setLevel(1);
    const newWord = getRandomWord(1);
    setCurrentWord(newWord);
    setGuessedLetters(new Set());
    setScore(0);
    setRoundScore(0);
    setWrongGuesses(0);
    setCurrentSpinValue(0);
    setGamePhase("spinning");
    setMessage("New game! Spin the wheel to start!");
    setGameOver(false);
    setWon(false);
    setWordsCompleted(0);
    setConsecutiveWins(0);
  }, []);

  const canBuyVowel =
    (roundScore >= VOWEL_COST || score >= VOWEL_COST) &&
    VOWELS.some((v) => !guessedLetters.has(v) && currentWord.toUpperCase().includes(v));

  return {
    level,
    currentWord,
    guessedLetters,
    score,
    roundScore,
    wrongGuesses,
    currentSpinValue,
    gamePhase,
    message,
    totalWins,
    totalLosses,
    gameOver,
    won,
    wordsCompleted,
    consecutiveWins,
    canBuyVowel,
    handleSpinResult,
    guessLetter,
    buyVowel,
    resetGame,
    setGamePhase,
    setMessage,
  };
}

// ============================================================
// FILE: /components/Wheel.tsx
// ============================================================

function Wheel({ currentAngle, isSpinning, onSpin, disabled }) {
  const canvasRef = useRef(null);
  const segmentCount = WHEEL_SEGMENTS.length;
  const segmentAngle = (2 * Math.PI) / segmentCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(((currentAngle % 360) * Math.PI) / 180);

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;
      const seg = WHEEL_SEGMENTS[i];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "#0a0a0a";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      const textAngle = startAngle + segmentAngle / 2;
      ctx.rotate(textAngle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${seg.type === "money" ? "13" : "10"}px 'Courier New', monospace`;
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 3;
      const displayLabel = seg.type === "money" ? `$${seg.label}` : seg.label;
      ctx.fillText(displayLabel, radius * 0.65, 0);
      ctx.restore();
    }

    ctx.restore();

    // Pointer
    ctx.beginPath();
    ctx.moveTo(center, 6);
    ctx.lineTo(center - 14, 0);
    ctx.lineTo(center + 14, 0);
    ctx.closePath();
    ctx.fillStyle = "#FF2D55";
    ctx.fill();
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);
  }, [currentAngle, segmentCount, segmentAngle]);

  return (
    <div style={styles.wheelContainer}>
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        style={{ ...styles.wheelCanvas, cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={disabled ? undefined : onSpin}
      />
      {!disabled && !isSpinning && (
        <button style={styles.spinButton} onClick={onSpin}>
          SPIN
        </button>
      )}
      {isSpinning && <div style={styles.spinningLabel}>Spinning...</div>}
    </div>
  );
}

// ============================================================
// FILE: /components/WordBoard.tsx
// ============================================================

function WordBoard({ word, guessedLetters, revealed }) {
  const chars = word.toUpperCase().split("");
  return (
    <div style={styles.wordBoardContainer}>
      <div style={styles.wordBoard}>
        {chars.map((ch, i) => {
          if (ch === " ") {
            return <div key={i} style={styles.spaceTile}><span style={styles.spaceLabel}>⎵</span></div>;
          }
          const isRevealed = revealed || guessedLetters.has(ch);
          return (
            <div key={i} style={{ ...styles.letterTile, ...(isRevealed ? styles.letterRevealed : {}) }}>
              <span style={styles.letterText}>{isRevealed ? ch : ""}</span>
            </div>
          );
        })}
      </div>
      <div style={styles.wordMeta}>
        {word.includes(" ") && <span style={styles.phraseHint}>📝 Multi-word phrase</span>}
        <span style={styles.letterCount}>{getUniqueLetters(word).size} unique letters</span>
      </div>
    </div>
  );
}

// ============================================================
// FILE: /components/Keyboard.tsx
// ============================================================

function Keyboard({ guessedLetters, onGuess, gamePhase, disabled }) {
  const isBuyingVowel = gamePhase === "buying_vowel";
  const isGuessing = gamePhase === "guessing" || gamePhase === "buying_vowel";

  return (
    <div style={styles.keyboardContainer}>
      {isBuyingVowel && <div style={styles.vowelBanner}>SELECT A VOWEL</div>}
      <div style={styles.keyboardGrid}>
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isVowelLetter = isVowel(letter);
          const isDisabled =
            disabled || isGuessed || !isGuessing || (isBuyingVowel && !isVowelLetter) || (!isBuyingVowel && isVowelLetter);

          let buttonStyle = { ...styles.keyButton };
          if (isGuessed) {
            buttonStyle = { ...buttonStyle, ...styles.keyGuessed };
          } else if (isVowelLetter) {
            buttonStyle = { ...buttonStyle, ...styles.keyVowel };
          }
          if (isDisabled && !isGuessed) {
            buttonStyle = { ...buttonStyle, ...styles.keyDisabled };
          }
          if (isBuyingVowel && isVowelLetter && !isGuessed) {
            buttonStyle = { ...buttonStyle, ...styles.keyVowelActive };
          }

          return (
            <button
              key={letter}
              style={buttonStyle}
              disabled={isDisabled}
              onClick={() => onGuess(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// FILE: /components/ScoreBoard.tsx
// ============================================================

function ScoreBoard({ score, roundScore, level, wrongGuesses, totalWins, wordsCompleted, consecutiveWins }) {
  return (
    <div style={styles.scoreBoard}>
      <div style={styles.scoreRow}>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>BANK</span>
          <span style={styles.scoreValue}>${score.toLocaleString()}</span>
        </div>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>ROUND</span>
          <span style={{ ...styles.scoreValue, color: "#50E3C2" }}>${roundScore.toLocaleString()}</span>
        </div>
      </div>
      <div style={styles.scoreRow}>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>LEVEL</span>
          <span style={styles.scoreValue}>{level}/10</span>
        </div>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>STRIKES</span>
          <span style={{ ...styles.scoreValue, color: wrongGuesses >= 4 ? "#FF2D55" : "#FFD700" }}>
            {"❌".repeat(wrongGuesses)}{"⬜".repeat(MAX_WRONG_GUESSES - wrongGuesses)}
          </span>
        </div>
      </div>
      <div style={styles.scoreRow}>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>SOLVED</span>
          <span style={styles.scoreValue}>{wordsCompleted}</span>
        </div>
        <div style={styles.scoreItem}>
          <span style={styles.scoreLabel}>STREAK</span>
          <span style={styles.scoreValue}>🔥 {consecutiveWins}</span>
        </div>
      </div>
      <div style={styles.levelBar}>
        <div style={{ ...styles.levelProgress, width: `${(level / 10) * 100}%` }} />
      </div>
    </div>
  );
}

// ============================================================
// FILE: App.tsx
// ============================================================

export default function App() {
  const {
    level,
    currentWord,
    guessedLetters,
    score,
    roundScore,
    wrongGuesses,
    gamePhase,
    message,
    totalWins,
    totalLosses,
    gameOver,
    won,
    wordsCompleted,
    consecutiveWins,
    canBuyVowel,
    handleSpinResult,
    guessLetter,
    buyVowel,
    resetGame,
    setGamePhase,
    setMessage,
  } = useGame();

  const { isSpinning, currentAngle, spin } = useWheel();

  const handleSpin = useCallback(async () => {
    if (isSpinning || gameOver) return;
    if (gamePhase !== "spinning") return;
    const result = await spin();
    if (result) handleSpinResult(result);
  }, [isSpinning, gameOver, gamePhase, spin, handleSpinResult]);

  const handleGuess = useCallback(
    (letter) => {
      guessLetter(letter);
    },
    [guessLetter]
  );

  const spinDisabled = isSpinning || gameOver || gamePhase !== "spinning";
  const keyboardDisabled = gameOver || gamePhase === "won_round";

  return (
    <div style={styles.appContainer}>
      <div style={styles.bgGlow} />
      <header style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🎡</span> WHEEL OF FORTUNE{" "}
          <span style={styles.titleIcon}>🎡</span>
        </h1>
        <p style={styles.subtitle}>AI & Computer Science Edition</p>
      </header>

      <div style={styles.messageBar}>
        <p style={styles.messageText}>{message}</p>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.leftPanel}>
          <ScoreBoard
            score={score}
            roundScore={roundScore}
            level={level}
            wrongGuesses={wrongGuesses}
            totalWins={totalWins}
            wordsCompleted={wordsCompleted}
            consecutiveWins={consecutiveWins}
          />
          <div style={styles.actionButtons}>
            {canBuyVowel && gamePhase === "spinning" && !gameOver && (
              <button style={styles.vowelButton} onClick={buyVowel}>
                BUY VOWEL (${VOWEL_COST})
              </button>
            )}
            {(gameOver || gamePhase === "won_round" && level >= 10) && (
              <button style={styles.resetButton} onClick={resetGame}>
                {won ? "🏆 PLAY AGAIN" : "🔄 NEW GAME"}
              </button>
            )}
          </div>
        </div>

        <div style={styles.centerPanel}>
          <Wheel
            currentAngle={currentAngle}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            disabled={spinDisabled}
          />
        </div>

        <div style={styles.rightPanel}>
          <WordBoard word={currentWord} guessedLetters={guessedLetters} revealed={gameOver} />
        </div>
      </div>

      <Keyboard
        guessedLetters={guessedLetters}
        onGuess={handleGuess}
        gamePhase={gamePhase}
        disabled={keyboardDisabled}
      />

      <footer style={styles.footer}>
        <span>Level {level} • {WORDS_BY_LEVEL[level]?.length || 0} words in pool • Theme: AI & CS</span>
      </footer>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  appContainer: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #0a0a1a 0%, #0d1b2a 30%, #1b2838 60%, #0a0a1a 100%)",
    color: "#E8E8E8",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    top: "-200px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "800px",
    background: "radial-gradient(circle, rgba(80,227,194,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  header: {
    textAlign: "center",
    marginBottom: "8px",
    zIndex: 1,
  },
  title: {
    fontSize: "28px",
    fontWeight: 900,
    color: "#FFD700",
    textShadow: "0 0 30px rgba(255,215,0,0.3), 0 2px 4px rgba(0,0,0,0.5)",
    margin: 0,
    letterSpacing: "3px",
  },
  titleIcon: {
    fontSize: "24px",
  },
  subtitle: {
    fontSize: "12px",
    color: "#50E3C2",
    letterSpacing: "4px",
    textTransform: "uppercase",
    margin: "4px 0 0",
    opacity: 0.8,
  },
  messageBar: {
    background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)",
    border: "1px solid rgba(255,215,0,0.2)",
    borderRadius: "8px",
    padding: "8px 24px",
    marginBottom: "12px",
    width: "100%",
    maxWidth: "900px",
    textAlign: "center",
    zIndex: 1,
  },
  messageText: {
    margin: 0,
    fontSize: "14px",
    color: "#FFD700",
    fontWeight: 600,
  },
  mainLayout: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1100px",
    zIndex: 1,
    flexWrap: "wrap",
  },
  leftPanel: {
    flex: "0 0 240px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  centerPanel: {
    flex: "0 0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightPanel: {
    flex: "1 1 300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  // Wheel
  wheelContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  wheelCanvas: {
    borderRadius: "50%",
    boxShadow: "0 0 40px rgba(255,215,0,0.15), 0 0 80px rgba(80,227,194,0.05), inset 0 0 30px rgba(0,0,0,0.3)",
    border: "4px solid rgba(255,215,0,0.3)",
  },
  spinButton: {
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    color: "#0a0a1a",
    border: "none",
    borderRadius: "8px",
    padding: "10px 32px",
    fontSize: "16px",
    fontWeight: 900,
    fontFamily: "'JetBrains Mono', monospace",
    cursor: "pointer",
    letterSpacing: "3px",
    boxShadow: "0 4px 20px rgba(255,215,0,0.3)",
    transition: "transform 0.15s",
  },
  spinningLabel: {
    color: "#50E3C2",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "2px",
    animation: "pulse 1s infinite",
  },
  // WordBoard
  wordBoardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    width: "100%",
  },
  wordBoard: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    justifyContent: "center",
    maxWidth: "480px",
  },
  letterTile: {
    width: "44px",
    height: "52px",
    background: "linear-gradient(180deg, #1e3a5f 0%, #0d2137 100%)",
    border: "2px solid rgba(80,227,194,0.3)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
  },
  letterRevealed: {
    background: "linear-gradient(180deg, #1a4a2e 0%, #0d3320 100%)",
    border: "2px solid rgba(80,227,194,0.6)",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3), 0 0 12px rgba(80,227,194,0.15)",
  },
  letterText: {
    fontSize: "22px",
    fontWeight: 900,
    color: "#50E3C2",
    textShadow: "0 0 8px rgba(80,227,194,0.4)",
  },
  spaceTile: {
    width: "44px",
    height: "52px",
    background: "rgba(255,255,255,0.03)",
    border: "2px dashed rgba(255,255,255,0.1)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceLabel: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.15)",
  },
  wordMeta: {
    display: "flex",
    gap: "16px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
  },
  phraseHint: {
    color: "rgba(255,215,0,0.5)",
  },
  letterCount: {},
  // Keyboard
  keyboardContainer: {
    width: "100%",
    maxWidth: "700px",
    margin: "12px 0",
    zIndex: 1,
  },
  vowelBanner: {
    textAlign: "center",
    color: "#FF2D55",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "3px",
    marginBottom: "6px",
    textShadow: "0 0 10px rgba(255,45,85,0.3)",
  },
  keyboardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    justifyContent: "center",
  },
  keyButton: {
    width: "42px",
    height: "42px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "linear-gradient(180deg, #2a2a4a 0%, #1a1a30 100%)",
    color: "#E8E8E8",
    fontSize: "15px",
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  keyVowel: {
    background: "linear-gradient(180deg, #3a2a5a 0%, #2a1a40 100%)",
    border: "1px solid rgba(155,89,182,0.3)",
    color: "#BB86FC",
  },
  keyGuessed: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.15)",
    cursor: "default",
    textDecoration: "line-through",
  },
  keyDisabled: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  keyVowelActive: {
    background: "linear-gradient(180deg, #6a3a8a 0%, #4a2a6a 100%)",
    border: "2px solid #BB86FC",
    color: "#FFFFFF",
    boxShadow: "0 0 12px rgba(187,134,252,0.3)",
    opacity: 1,
  },
  // ScoreBoard
  scoreBoard: {
    background: "linear-gradient(180deg, rgba(26,26,46,0.9) 0%, rgba(10,10,26,0.9) 100%)",
    border: "1px solid rgba(255,215,0,0.15)",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    backdropFilter: "blur(10px)",
  },
  scoreRow: {
    display: "flex",
    gap: "8px",
  },
  scoreItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "6px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "6px",
  },
  scoreLabel: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "2px",
    fontWeight: 600,
  },
  scoreValue: {
    fontSize: "16px",
    fontWeight: 900,
    color: "#FFD700",
    marginTop: "2px",
  },
  levelBar: {
    height: "4px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  levelProgress: {
    height: "100%",
    background: "linear-gradient(90deg, #50E3C2, #FFD700)",
    borderRadius: "2px",
    transition: "width 0.5s ease",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  vowelButton: {
    background: "linear-gradient(135deg, #9B59B6, #8E44AD)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
    cursor: "pointer",
    letterSpacing: "1px",
    boxShadow: "0 4px 15px rgba(155,89,182,0.3)",
  },
  resetButton: {
    background: "linear-gradient(135deg, #E74C3C, #C0392B)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
    cursor: "pointer",
    letterSpacing: "1px",
    boxShadow: "0 4px 15px rgba(231,76,60,0.3)",
  },
  footer: {
    marginTop: "8px",
    fontSize: "10px",
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "1px",
    zIndex: 1,
  },
};