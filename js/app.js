let currentFinderStep = 1;
let finderAnswers = [];

const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

function scrollToSection(id){
  const el = document.getElementById(id);
  if(el){
    el.scrollIntoView({behavior:"smooth",block:"start"});
  }
}

function showToast(message){
  toastText.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(()=>{
    toast.classList.remove("show");
  },3000);
}

function openModal(content){
  modalContent.innerHTML = content;
  modalOverlay.classList.add("show");
}

function closeModal(){
  modalOverlay.classList.remove("show");
}

modalOverlay.addEventListener("click",(e)=>{
  if(e.target === modalOverlay){
    closeModal();
  }
});

function openFinder(category=""){
  if(category){
    openModal(`
      <span class="section-label">INSURANCE FINDER</span>
      <h2>${category} protection</h2>
      <p>
        This demo helps users understand the type of protection
        they may want to research.
      </p>

      <div class="modal-options">
        <button onclick="showToast('Health protection guide selected.');closeModal()">
          Understand coverage →
        </button>
        <button onclick="showToast('Calculator opened.');closeModal();scrollToSection('planner')">
          Use planning calculator →
        </button>
        <button onclick="showToast('Comparison module selected.');closeModal()">
          Compare concepts →
        </button>
      </div>
    `);
    return;
  }

  openModal(`
    <span class="section-label">SMART FINDER</span>
    <h2>What do you want to protect?</h2>
    <p>Select a category to begin an illustrative discovery journey.</p>

    <div class="modal-options">
      <button onclick="closeModal();scrollToSection('finder')">♡ Health</button>
      <button onclick="closeModal();scrollToSection('finder')">◈ Life</button>
      <button onclick="closeModal();scrollToSection('finder')">◇ Motor</button>
      <button onclick="closeModal();scrollToSection('finder')">⌂ Home</button>
      <button onclick="closeModal();scrollToSection('finder')">✈ Travel</button>
    </div>
  `);
}

function openPlanner(){
  scrollToSection("planner");
}

function finderNext(answer){

  finderAnswers.push(answer);
  currentFinderStep++;

  const progress = Math.min(currentFinderStep * 25,100);

  document.getElementById("finderProgress").style.width = progress + "%";
  document.getElementById("finderStep").textContent =
    Math.min(currentFinderStep,4) + " / 4";

  const content = document.getElementById("finderContent");

  if(currentFinderStep === 2){

    content.innerHTML = `
      <div class="finder-question">
        <span>02</span>
        <h3>Who needs protection?</h3>
      </div>

      <div class="option-grid">
        <button class="finder-option" onclick="finderNext('Self')">
          <b>Just me</b>
          <small>Individual protection</small>
        </button>

        <button class="finder-option" onclick="finderNext('Family')">
          <b>My family</b>
          <small>Partner, children or dependants</small>
        </button>

        <button class="finder-option" onclick="finderNext('Parents')">
          <b>Parents</b>
          <small>Support for parents</small>
        </button>

        <button class="finder-option" onclick="finderNext('Business')">
          <b>Business</b>
          <small>Business or employees</small>
        </button>
      </div>
    `;

  }else if(currentFinderStep === 3){

    content.innerHTML = `
      <div class="finder-question">
        <span>03</span>
        <h3>What is your main planning priority?</h3>
      </div>

      <div class="option-grid">
        <button class="finder-option" onclick="finderNext('Medical expenses')">
          <b>Medical expenses</b>
          <small>Hospital and healthcare costs</small>
        </button>

        <button class="finder-option" onclick="finderNext('Income protection')">
          <b>Income protection</b>
          <small>Support during major risks</small>
        </button>

        <button class="finder-option" onclick="finderNext('Assets')">
          <b>Assets</b>
          <small>Vehicle, home or property</small>
        </button>

        <button class="finder-option" onclick="finderNext('Travel risk')">
          <b>Travel</b>
          <small>Protection while travelling</small>
        </button>
      </div>
    `;

  }else{

    content.innerHTML = `
      <div class="finder-question">
        <span>04</span>
        <h3>How would you like to continue?</h3>
      </div>

      <div class="option-grid">
        <button class="finder-option" onclick="finderComplete('Learn')">
          <b>Learn first</b>
          <small>Read about relevant insurance concepts</small>
        </button>

        <button class="finder-option" onclick="finderComplete('Plan')">
          <b>Build a plan</b>
          <small>Use our illustrative calculators</small>
        </button>

        <button class="finder-option" onclick="finderComplete('Compare')">
          <b>Compare</b>
          <small>Understand different coverage structures</small>
        </button>

        <button class="finder-option" onclick="finderComplete('Save')">
          <b>Save my roadmap</b>
          <small>Available when user accounts are connected</small>
        </button>
      </div>
    `;
  }
}

function finderComplete(choice){

  openModal(`
    <span class="section-label">YOUR ROADMAP</span>
    <h2>Protection discovery complete.</h2>
    <p>
      Your selected journey is ready for the next step.
      In this demo, the result is illustrative and does not recommend
      a particular insurer or policy.
    </p>

    <div class="modal-options">
      <button onclick="closeModal();scrollToSection('planner')">
        Open protection planner →
      </button>

      <button onclick="closeModal();scrollToSection('knowledge')">
        Explore knowledge hub →
      </button>
    </div>
  `);

  showToast("Your illustrative roadmap is ready.");
}

function calculateHealth(){

  const members =
    Number(document.getElementById("healthMembers").value) || 1;

  const budget =
    Number(document.getElementById("healthBudget").value) || 0;

  const existing =
    Number(document.getElementById("healthExisting").value) || 0;

  const target = Math.max(
    members * budget * 2,
    500000
  );

  const gap = Math.max(target - existing,0);

  document.getElementById("healthResult").innerHTML = `
    <div>
      <small>Illustrative protection target</small>
      <strong>${formatMoney(target)}</strong>
    </div>

    <div>
      <small>Illustrative gap</small>
      <strong>${formatMoney(gap)}</strong>
    </div>
  `;

  showToast("Protection calculation updated.");
}

function formatMoney(value){

  return "₹" + Number(value).toLocaleString("en-IN");
}

function calculateLife(){

  const income =
    Number(document.getElementById("lifeIncome").value) || 0;

  const years =
    Number(document.getElementById("lifeYears").value) || 0;

  const liabilities =
    Number(document.getElementById("lifeLiability").value) || 0;

  const savings =
    Number(document.getElementById("lifeSavings").value) || 0;

  const target =
    Math.max((income * years) + liabilities - savings,0);

  document.getElementById("lifeResult").innerHTML = `
    <div>
      <small>Illustrative protection requirement</small>
      <strong>${formatMoney(target)}</strong>
    </div>
    <div>
      <small>Planning basis</small>
      <strong>${years} years</strong>
    </div>
  `;

  showToast("Life planning view updated.");
}

function calculateMotor(){

  const vehicle =
    Number(document.getElementById("motorValue").value) || 0;

  const age =
    Number(document.getElementById("motorAge").value) || 0;

  const result =
    Math.max(vehicle * (age > 5 ? .55 : .75),0);

  document.getElementById("motorResult").innerHTML = `
    <div>
      <small>Illustrative vehicle value basis</small>
      <strong>${formatMoney(result)}</strong>
    </div>
    <div>
      <small>Vehicle age</small>
      <strong>${age} years</strong>
    </div>
  `;

  showToast("Motor planning view updated.");
}

function switchCalc(type,button){

  document.querySelectorAll(".planner-tab")
    .forEach(x=>x.classList.remove("active"));

  button.classList.add("active");

  const area = document.getElementById("calculatorArea");

  if(type === "health"){

    area.innerHTML = `
      <div class="calc-header">
        <span class="calc-symbol">♡</span>
        <div>
          <h3>Health protection planner</h3>
          <p>Illustrative estimate based on simple inputs.</p>
        </div>
      </div>

      <div class="input-grid">
        <label>
          <span>Family members</span>
          <input id="healthMembers" type="number" value="4" min="1">
        </label>

        <label>
          <span>Annual medical budget</span>
          <div class="input-money">
            <b>₹</b>
            <input id="healthBudget" type="number" value="50000">
          </div>
        </label>

        <label>
          <span>Existing cover</span>
          <div class="input-money">
            <b>₹</b>
            <input id="healthExisting" type="number" value="300000">
          </div>
        </label>
      </div>

      <button class="calculate-btn" onclick="calculateHealth()">
        Calculate protection view →
      </button>

      <div class="calc-result" id="healthResult">
        <div>
          <small>Illustrative target</small>
          <strong>₹5.0L</strong>
        </div>
        <div>
          <small>Illustrative gap</small>
          <strong>₹2.0L</strong>
        </div>
      </div>
    `;

  }else if(type === "life"){

    area.innerHTML = `
      <div class="calc-header">
        <span class="calc-symbol">◈</span>
        <div>
          <h3>Life protection planner</h3>
          <p>Illustrative income-replacement framework.</p>
        </div>
      </div>

      <div class="input-grid">
        <label>
          <span>Annual income</span>
          <div class="input-money">
            <b>₹</b>
            <input id="lifeIncome" type="number" value="600000">
          </div>
        </label>

        <label>
          <span>Years to protect</span>
          <input id="lifeYears" type="number" value="15">
        </label>

        <label>
          <span>Liabilities</span>
          <div class="input-money">
            <b>₹</b>
            <input id="lifeLiability" type="number" value="500000">
          </div>
        </label>

        <label>
          <span>Savings / assets</span>
          <div class="input-money">
            <b>₹</b>
            <input id="lifeSavings" type="number" value="200000">
          </div>
        </label>
      </div>

      <button class="calculate-btn" onclick="calculateLife()">
        Calculate life planning view →
      </button>

      <div class="calc-result" id="lifeResult">
        <div>
          <small>Illustrative requirement</small>
          <strong>₹93L</strong>
        </div>
        <div>
          <small>Planning period</small>
          <strong>15 years</strong>
        </div>
      </div>
    `;

  }else{

    area.innerHTML = `
      <div class="calc-header">
        <span class="calc-symbol">◇</span>
        <div>
          <h3>Motor planning guide</h3>
          <p>Illustrative vehicle-value planning tool.</p>
        </div>
      </div>

      <div class="input-grid">
        <label>
          <span>Vehicle value</span>
          <div class="input-money">
            <b>₹</b>
            <input id="motorValue" type="number" value="800000">
          </div>
        </label>

        <label>
          <span>Vehicle age</span>
          <input id="motorAge" type="number" value="3">
        </label>
      </div>

      <button class="calculate-btn" onclick="calculateMotor()">
        Calculate motor planning view →
      </button>

      <div class="calc-result" id="motorResult">
        <div>
          <small>Illustrative value basis</small>
          <strong>₹6.0L</strong>
        </div>
        <div>
          <small>Vehicle age</small>
          <strong>3 years</strong>
        </div>
      </div>
    `;
  }
}

function openCalculator(type){

  scrollToSection("planner");

  setTimeout(()=>{
    const tabs = document.querySelectorAll(".planner-tab");

    if(type === "health") switchCalc("health",tabs[0]);
    if(type === "life") switchCalc("life",tabs[1]);
    if(type === "motor") switchCalc("motor",tabs[2]);

  },500);
}

function toggleFaq(button){

  const item = button.parentElement;

  document.querySelectorAll(".faq-item")
    .forEach(x=>{
      if(x !== item) x.classList.remove("open");
    });

  item.classList.toggle("open");

  button.querySelector("b").textContent =
    item.classList.contains("open") ? "−" : "+";
}

function showArticle(title){

  const articles = {
    "Waiting periods":
      "A waiting period is a period during which certain specified claims or conditions may not be covered. The exact duration and applicable conditions depend on the policy wording.",

    "Sum insured":
      "Sum insured is the stated maximum amount of coverage for applicable benefits, subject to the terms, conditions, limits and exclusions of the policy.",

    "Exclusions":
      "Exclusions identify circumstances, treatments, losses or events that a policy does not cover. Reading exclusions is an important part of understanding any insurance contract."
  };

  openModal(`
    <span class="section-label">KNOWLEDGE HUB</span>
    <h2>${title}</h2>
    <p>${articles[title] || "Educational insurance guide."}</p>
    <p>
      Always review the actual policy wording, schedule,
      exclusions and applicable terms before making a purchase decision.
    </p>
  `);
}

document.getElementById("searchBtn").addEventListener("click",()=>{

  openModal(`
    <span class="section-label">GLOBAL SEARCH</span>
    <h2>Search Insurance Hub</h2>

    <input
      id="globalSearch"
      type="text"
      placeholder="Search health, life, claims..."
      style="
        width:100%;
        margin-top:20px;
        padding:15px;
        border:1px solid var(--line);
        border-radius:12px;
        background:#081625;
        color:white;
        outline:none;
      "
    >

    <div class="modal-options">
      <button onclick="showToast('Search index will connect to the knowledge database in production.');">
        Search →
      </button>
    </div>
  `);

});

document.getElementById("themeBtn").addEventListener("click",()=>{

  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){
    document.documentElement.style.setProperty("--bg","#eef5fa");
    document.documentElement.style.setProperty("--bg2","#ffffff");
    document.documentElement.style.setProperty("--card","#ffffff");
    document.documentElement.style.setProperty("--card2","#f3f7fa");
    document.documentElement.style.setProperty("--text","#0a1828");
    document.documentElement.style.setProperty("--muted","#607286");
    document.documentElement.style.setProperty("--line","rgba(10,24,40,.1)");
    document.getElementById("themeBtn").textContent="☾";
  }else{
    document.documentElement.style.setProperty("--bg","#07111f");
    document.documentElement.style.setProperty("--bg2","#0b1728");
    document.documentElement.style.setProperty("--card","#0d1c2e");
    document.documentElement.style.setProperty("--card2","#10243a");
    document.documentElement.style.setProperty("--text","#f5f8fc");
    document.documentElement.style.setProperty("--muted","#8fa3b8");
    document.documentElement.style.setProperty("--line","rgba(255,255,255,.09)");
    document.getElementById("themeBtn").textContent="☼";
  }

});

document.getElementById("profileBtn").addEventListener("click",()=>{

  openModal(`
    <span class="section-label">DEMO PROFILE</span>
    <h2>Demo User</h2>
    <p>
      Account functionality is intentionally simulated in this
      frontend-only version.
    </p>

    <div class="modal-options">
      <button onclick="showToast('Login system requires backend integration.')">
        Sign in
      </button>

      <button onclick="showToast('Account creation requires backend integration.')">
        Create account
      </button>
    </div>
  `);

});

const observer = new IntersectionObserver(
  entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity="1";
        entry.target.style.transform="translateY(0)";
      }
    });
  },
  {threshold:.08}
);

document.querySelectorAll(
  ".solution-card,.workspace-card,.article-card,.quick-card,.timeline-item"
).forEach(el=>{
  el.style.opacity="0";
  el.style.transform="translateY(18px)";
  el.style.transition="opacity .6s ease,transform .6s ease";
  observer.observe(el);
});

window.addEventListener("scroll",()=>{

  const sections = [
    "home",
    "solutions",
    "planner",
    "claims",
    "knowledge"
  ];

  let current = "home";

  sections.forEach(id=>{
    const section = document.getElementById(id);

    if(section && window.scrollY >= section.offsetTop - 180){
      current = id;
    }
  });

  document.querySelectorAll(".desktop-nav a")
    .forEach(link=>{
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current
      );
    });

});
