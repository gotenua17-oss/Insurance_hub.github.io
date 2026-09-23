(function(){

  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const header = $("#siteHeader");

  function updateHeader(){
    if(!header) return;

    if(window.scrollY > 20){
      header.classList.add("scrolled");
    }else{
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {passive:true});
  updateHeader();

  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  if(menuBtn && mobileMenu){
    menuBtn.addEventListener("click", function(){
      mobileMenu.classList.toggle("active");

      const expanded =
        mobileMenu.classList.contains("active");

      menuBtn.setAttribute(
        "aria-expanded",
        String(expanded)
      );
    });

    $$("#mobileMenu a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  const toast = $("#toast");
  const toastText = $("#toastText");
  let toastTimer;

  function showToast(message){
    if(!toast) return;

    if(toastText){
      toastText.textContent = message;
    }

    toast.classList.add("active");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("active");
    }, 2800);
  }

  const searchBtn = $("#searchBtn");
  const searchOverlay = $("#searchOverlay");
  const searchClose = $("#searchClose");
  const globalSearchInput = $("#globalSearchInput");
  const globalSearchButton = $("#globalSearchButton");
  const searchResult = $("#searchResult");

  function openSearch(){
    if(!searchOverlay) return;

    searchOverlay.classList.add("active");

    setTimeout(() => {
      if(globalSearchInput){
        globalSearchInput.focus();
      }
    }, 150);
  }

  function closeSearch(){
    if(!searchOverlay) return;

    searchOverlay.classList.remove("active");
  }

  if(searchBtn){
    searchBtn.addEventListener("click", openSearch);
  }

  if(searchClose){
    searchClose.addEventListener("click", closeSearch);
  }

  if(searchOverlay){
    searchOverlay.addEventListener("click", function(event){
      if(event.target === searchOverlay){
        closeSearch();
      }
    });
  }

  function performSearch(value){
    const query = String(value || "").trim();

    if(!query){
      if(searchResult){
        searchResult.textContent =
          "Type an insurance product or category to search.";
      }
      return;
    }

    const normalized = query.toLowerCase();

    const categories = [
      "vehicle insurance",
      "health insurance",
      "life insurance",
      "travel insurance",
      "home insurance",
      "personal insurance",
      "agriculture insurance",
      "business insurance"
    ];

    const match = categories.find(item =>
      item.includes(normalized) ||
      normalized.includes(item.replace(" insurance",""))
    );

    if(searchResult){
      searchResult.textContent = match
        ? `Insurance Hub found: ${match.replace(/\b\w/g,c => c.toUpperCase())}`
        : `Search received for “${query}”. Product matching will be connected in the next module.`;
    }
  }

  if(globalSearchButton){
    globalSearchButton.addEventListener("click", () => {
      performSearch(globalSearchInput?.value);
    });
  }

  if(globalSearchInput){
    globalSearchInput.addEventListener("keydown", event => {
      if(event.key === "Enter"){
        performSearch(globalSearchInput.value);
      }

      if(event.key === "Escape"){
        closeSearch();
      }
    });
  }

  $$("[data-search]").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.search || "";

      if(globalSearchInput){
        globalSearchInput.value = value;
      }

      performSearch(value);
    });
  });

  const heroSearch = $("#heroSearch");
  const heroSearchButton = $("#heroSearchButton");

  function heroSearchAction(){
    const value = heroSearch?.value?.trim();

    if(!value){
      showToast("Please enter an insurance category.");
      return;
    }

    openSearch();

    if(globalSearchInput){
      globalSearchInput.value = value;
    }

    performSearch(value);
  }

  if(heroSearchButton){
    heroSearchButton.addEventListener(
      "click",
      heroSearchAction
    );
  }

  if(heroSearch){
    heroSearch.addEventListener("keydown", event => {
      if(event.key === "Enter"){
        heroSearchAction();
      }
    });
  }

  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      if(heroSearch){
        heroSearch.value = category;
      }

      showToast(`${category} selected.`);

      const store =
        document.querySelector("#store");

      if(store){
        store.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      }
    });
  });

  const finderBtn = $("#finderBtn");

  if(finderBtn){
    finderBtn.addEventListener("click", () => {
      openSearch();

      if(globalSearchInput){
        globalSearchInput.placeholder =
          "Tell us what you want to protect...";
      }

      showToast("Smart Finder opened.");
    });
  }

  $$(".category-links button").forEach(button => {
    button.addEventListener("click", () => {
      showToast(
        `${button.textContent.trim()} selected.`
      );
    });
  });

  $$(".product-bottom button").forEach(button => {
    button.addEventListener("click", () => {
      showToast(
        "Product journey will open in the Insurance Store module."
      );
    });
  });

  $$('a[href="#"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      if(link.classList.contains("brand")){
        window.scrollTo({
          top:0,
          behavior:"smooth"
        });
        return;
      }

      showToast(
        "This feature will be connected in the next module."
      );
    });
  });

  document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
      closeSearch();
      mobileMenu?.classList.remove("active");
    }
  });

  /* =========================================================
     INSURANCE STORE — PRODUCT INTERACTION
     ========================================================= */

  $$("[data-product]").forEach(button => {
    button.addEventListener("click", () => {

      const product = button.dataset.product || "";
      const card = button.closest("[data-insurance]");
      const category =
        card?.dataset.insurance || "Insurance";

      showToast(
        `${product} selected — ${category}`
      );

      if(heroSearch){
        heroSearch.value = product;
      }

      const store =
        document.querySelector("#store");

      if(store){
        store.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  $$("[data-insurance]").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("store-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("store-active");
    });
  });

  /* =========================================================
     VEHICLE INSURANCE — SELECTION FLOW
     ========================================================= */

  const vehicleOptions =
    $$("[data-vehicle-type]");

  const commercialTypes =
    $("#commercialTypes");

  const commercialClose =
    $("#commercialClose");

  const selectedVehicleText =
    $("#selectedVehicleText");

  const vehicleContinue =
    $("#vehicleContinue");

  let selectedVehicle = "";

  function selectVehicle(value){

    selectedVehicle = value;

    vehicleOptions.forEach(option => {
      option.classList.toggle(
        "selected",
        option.dataset.vehicleType === value
      );
    });

    if(selectedVehicleText){
      selectedVehicleText.textContent = value;
    }

    if(vehicleContinue){
      vehicleContinue.disabled = !value;
    }

    if(value === "Commercial Vehicle"){
      commercialTypes?.classList.add("active");
    }else{
      commercialTypes?.classList.remove("active");

      $$("[data-commercial-type]").forEach(button => {
        button.classList.remove("selected");
      });
    }
  }

  vehicleOptions.forEach(option => {

    option.addEventListener("click", () => {

      const value =
        option.dataset.vehicleType || "";

      selectVehicle(value);

      showToast(
        `${value} selected.`
      );

    });

  });


  $$("[data-commercial-type]").forEach(button => {

    button.addEventListener("click", () => {

      const type =
        button.dataset.commercialType || "";

      $$("[data-commercial-type]").forEach(item => {
        item.classList.remove("selected");
      });

      button.classList.add("selected");

      selectedVehicle =
        `Commercial Vehicle — ${type}`;

      if(selectedVehicleText){
        selectedVehicleText.textContent =
          selectedVehicle;
      }

      if(vehicleContinue){
        vehicleContinue.disabled = false;
      }

      showToast(
        `${type} selected.`
      );

    });

  });


  if(commercialClose){

    commercialClose.addEventListener(
      "click",
      () => {

        commercialTypes?.classList.remove("active");

        $$("[data-commercial-type]").forEach(button => {
          button.classList.remove("selected");
        });

        selectVehicle("");

        showToast(
          "Commercial vehicle selection closed."
        );

      }
    );

  }


  if(vehicleContinue){

    vehicleContinue.addEventListener(
      "click",
      () => {

        if(!selectedVehicle){
          showToast(
            "Please select a vehicle type first."
          );
          return;
        }

        showToast(
          `${selectedVehicle} — Vehicle details will open in the next step.`
        );

      }
    );

  }

  /* =========================================================
     VEHICLE DETAILS FORM — VALIDATION FLOW
     ========================================================= */

  const vehicleDetailsForm =
    $("#vehicleDetailsForm");

  const vehicleDetailsSection =
    $("#vehicle-details");

  const vehicleDetailsSubmit =
    $("#vehicleDetailsSubmit");

  const vehicleDetailsFields =
    vehicleDetailsForm
      ? $$("input, select", vehicleDetailsForm)
      : [];

  function openVehicleDetailsForm(){

    if(!vehicleDetailsSection){
      showToast(
        "Vehicle details section is unavailable."
      );
      return;
    }

    vehicleDetailsSection.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

    setTimeout(() => {

      const firstField =
        $("#registrationNo");

      if(firstField){
        firstField.focus();
      }

    }, 650);

  }


  if(vehicleContinue){

    vehicleContinue.addEventListener(
      "click",
      () => {

        if(!selectedVehicle){

          showToast(
            "Please select a vehicle type first."
          );

          return;

        }

        showToast(
          `${selectedVehicle} selected. Enter vehicle details.`
        );

        openVehicleDetailsForm();

      }
    );

  }


  function clearFieldError(field){

    if(!field){
      return;
    }

    field.classList.remove(
      "field-error"
    );

    field.removeAttribute(
      "aria-invalid"
    );

  }


  function markFieldError(field){

    if(!field){
      return;
    }

    field.classList.add(
      "field-error"
    );

    field.setAttribute(
      "aria-invalid",
      "true"
    );

  }


  vehicleDetailsFields.forEach(field => {

    field.addEventListener(
      "input",
      () => clearFieldError(field)
    );

    field.addEventListener(
      "change",
      () => clearFieldError(field)
    );

  });


  if(vehicleDetailsForm){

    vehicleDetailsForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        let firstInvalid = null;

        vehicleDetailsFields.forEach(field => {

          clearFieldError(field);

          if(
            field.required &&
            !field.value.trim()
          ){

            markFieldError(field);

            if(!firstInvalid){
              firstInvalid = field;
            }

          }

        });


        if(firstInvalid){

          showToast(
            "Please complete all required vehicle details."
          );

          firstInvalid.focus();

          return;

        }


        const formData =
          new FormData(vehicleDetailsForm);

        const vehicleData = {

          vehicleType:
            selectedVehicle || "Not selected",

          registrationNo:
            formData.get("registrationNo") || "",

          engineNo:
            formData.get("engineNo") || "",

          chassisNo:
            formData.get("chassisNo") || "",

          make:
            formData.get("make") || "",

          model:
            formData.get("model") || "",

          variant:
            formData.get("variant") || "",

          manufacturingYear:
            formData.get("manufacturingYear") || "",

          registrationDate:
            formData.get("registrationDate") || "",

          fuelType:
            formData.get("fuelType") || "",

          gvw:
            formData.get("gvw") || "",

          seatingCapacity:
            formData.get("seatingCapacity") || "",

          vehicleUsage:
            formData.get("vehicleUsage") || "",

          previousInsurer:
            formData.get("previousInsurer") || "",

          previousPolicy:
            formData.get("previousPolicy") || "",

          policyExpiry:
            formData.get("policyExpiry") || "",

          claimHistory:
            formData.get("claimHistory") || "",

          ncb:
            formData.get("ncb") || ""

        };


        window.insuranceHubVehicleData =
          vehicleData;


        showToast(
          "Vehicle details saved. Plan matching is ready for the next step."
        );

        if(vehicleDetailsSubmit){

          vehicleDetailsSubmit.classList.add(
            "form-success"
          );

          vehicleDetailsSubmit.innerHTML =
            'Details Saved <span>✓</span>';

        }

        console.log(
          "Insurance Hub Vehicle Data:",
          vehicleData
        );

      }
    );

  }

})();

/* =========================================================
   VEHICLE PLAN MATCHING — SELECTION & QUOTE FLOW
   ========================================================= */

const vehiclePlanGrid =
  $("#vehiclePlanGrid");

const selectedPlanPanel =
  $("#selectedPlanPanel");

const selectedPlanName =
  $("#selectedPlanName");

const selectedPlanMeta =
  $("#selectedPlanMeta");

const planContinue =
  $("#planContinue");

const matchedVehicle =
  $("#matchedVehicle");

const matchedPlanCount =
  $("#matchedPlanCount");

let selectedInsurancePlan = null;


/* =========================
   UPDATE MATCHED VEHICLE
   ========================= */

function updateMatchedVehicle(){

  if(!matchedVehicle){
    return;
  }

  const vehicle =
    window.insuranceHubVehicleData?.vehicleType ||
    selectedVehicle ||
    "Your selected vehicle";

  matchedVehicle.textContent = vehicle;
}

updateMatchedVehicle();


/* =========================
   PLAN CARDS
   ========================= */

const vehiclePlanCards =
  vehiclePlanGrid
    ? $$(".plan-card", vehiclePlanGrid)
    : [];

if(matchedPlanCount){
  matchedPlanCount.textContent =
    `${vehiclePlanCards.length} Plans`;
}


/* =========================
   SELECT PLAN
   ========================= */

vehiclePlanCards.forEach(card => {

  const selectButton =
    $(".plan-select-btn", card);

  const detailsButton =
    $(".plan-details-btn", card);

  if(selectButton){

    selectButton.addEventListener("click", () => {

      vehiclePlanCards.forEach(item => {
        item.classList.remove("plan-selected");
      });

      card.classList.add("plan-selected");

      const planId =
        card.dataset.planId || "";

      const planName =
        card.dataset.planName || "Selected Plan";

      const premium =
        Number(card.dataset.planPremium || 0);

      selectedInsurancePlan = {
        id: planId,
        name: planName,
        premium: premium
      };

      if(selectedPlanName){
        selectedPlanName.textContent =
          planName;
      }

      if(selectedPlanMeta){

        selectedPlanMeta.textContent =
          `Indicative annual premium: ₹${premium.toLocaleString("en-IN")} • Demo quote`;
      }

      if(selectedPlanPanel){
        selectedPlanPanel.hidden = false;
        selectedPlanPanel.scrollIntoView({
          behavior:"smooth",
          block:"nearest"
        });
      }

      showToast(`${planName} selected.`);

    });

  }


  /* =========================
     VIEW DETAILS
     ========================= */

  if(detailsButton){

    detailsButton.addEventListener("click", () => {

      const planName =
        card.dataset.planName || "Plan";

      const premium =
        Number(card.dataset.planPremium || 0);

      showToast(
        `${planName} • Indicative premium ₹${premium.toLocaleString("en-IN")}`
      );

    });

  }

});


/* =========================
   CONTINUE TO QUOTE
   ========================= */

if(planContinue){

  planContinue.addEventListener("click", () => {

    if(!selectedInsurancePlan){

      showToast(
        "Please select a plan first."
      );

      return;
    }

    const vehicle =
      window.insuranceHubVehicleData?.vehicleType ||
      selectedVehicle ||
      "Vehicle";

    const quoteId =
      `IH-${Date.now().toString().slice(-8)}`;

    window.insuranceHubQuote = {

      quoteId,

      vehicleType: vehicle,

      planId:
        selectedInsurancePlan.id,

      planName:
        selectedInsurancePlan.name,

      indicativePremium:
        selectedInsurancePlan.premium,

      createdAt:
        new Date().toISOString(),

      status:
        "DEMO"

    };

    showToast(
      `Quote ${quoteId} created for ${selectedInsurancePlan.name}.`
    );

    console.log(
      "Insurance Hub Demo Quote:",
      window.insuranceHubQuote
    );

  });

}


/* =========================================================
   VEHICLE QUOTE ENGINE — JS INTEGRATION
   ========================================================= */

const quoteEngineSection =
  $("#quote-engine");

const generateQuoteBtn =
  $("#generateQuoteBtn");

const saveQuoteBtn =
  $("#saveQuoteBtn");

const quoteEngineId =
  $("#quoteEngineId");

const quoteEngineStatus =
  $("#quoteEngineStatus");

const quotePlanName =
  $("#quotePlanName");

const quotePlanInsurer =
  $("#quotePlanInsurer");

const quotePremium =
  $("#quotePremium");

const quoteBasePremium =
  $("#quoteBasePremium");

const quoteTax =
  $("#quoteTax");

const quoteTotal =
  $("#quoteTotal");

const quoteVehicleName =
  $("#quoteVehicleName");

const quoteRegistration =
  $("#quoteRegistration");

const quoteMakeModel =
  $("#quoteMakeModel");

const quoteFuel =
  $("#quoteFuel");

const quoteYear =
  $("#quoteYear");

const quoteNCB =
  $("#quoteNCB");


/* =========================
   FORMAT CURRENCY
   ========================= */

function formatQuoteCurrency(value){

  return `₹${Number(value || 0).toLocaleString("en-IN")}`;

}


/* =========================
   GET VEHICLE DATA
   ========================= */

function getQuoteVehicleData(){

  return window.insuranceHubVehicleData || {};

}


/* =========================
   GENERATE QUOTE
   ========================= */

if(generateQuoteBtn){

  generateQuoteBtn.addEventListener("click", () => {

    if(!selectedInsurancePlan){

      showToast(
        "Please select a plan before generating a quote."
      );

      return;

    }


    const vehicleData =
      getQuoteVehicleData();

    const basePremium =
      Number(
        selectedInsurancePlan.premium || 0
      );

    /*
      Demo GST calculation.
      This is prototype logic only.
    */

    const tax =
      Math.round(basePremium * 0.18);

    const total =
      basePremium + tax;

    const quoteId =
      `IH-${Date.now().toString().slice(-8)}`;


    window.insuranceHubQuote = {

      quoteId,

      vehicleType:
        vehicleData.vehicleType ||
        selectedVehicle ||
        "Vehicle",

      registrationNo:
        vehicleData.registrationNo || "",

      make:
        vehicleData.make || "",

      model:
        vehicleData.model || "",

      fuelType:
        vehicleData.fuelType || "",

      manufacturingYear:
        vehicleData.manufacturingYear || "",

      ncb:
        vehicleData.ncb || "",

      planId:
        selectedInsurancePlan.id,

      planName:
        selectedInsurancePlan.name,

      basePremium,

      tax,

      total,

      status:
        "GENERATED",

      createdAt:
        new Date().toISOString()

    };


    /* =========================
       UPDATE QUOTE UI
       ========================= */

    if(quoteEngineId){

      quoteEngineId.textContent =
        quoteId;

    }

    if(quoteEngineStatus){

      quoteEngineStatus.textContent =
        "GENERATED";

    }

    if(quotePlanName){

      quotePlanName.textContent =
        selectedInsurancePlan.name;

    }

    if(quotePlanInsurer){

      const insurer =
        selectedInsurancePlan.id === "plan-01"
          ? "Demo Insurer A"
          : selectedInsurancePlan.id === "plan-02"
            ? "Demo Insurer B"
            : "Demo Insurer C";

      quotePlanInsurer.textContent =
        `${insurer} • Sample plan`;

    }

    if(quotePremium){

      quotePremium.textContent =
        formatQuoteCurrency(total);

    }

    if(quoteBasePremium){

      quoteBasePremium.textContent =
        formatQuoteCurrency(basePremium);

    }

    if(quoteTax){

      quoteTax.textContent =
        formatQuoteCurrency(tax);

    }

    if(quoteTotal){

      quoteTotal.textContent =
        formatQuoteCurrency(total);

    }


    /* =========================
       VEHICLE SUMMARY
       ========================= */

    if(quoteVehicleName){

      quoteVehicleName.textContent =
        vehicleData.vehicleType ||
        selectedVehicle ||
        "Vehicle";

    }

    if(quoteRegistration){

      quoteRegistration.textContent =
        vehicleData.registrationNo ||
        "—";

    }

    if(quoteMakeModel){

      const make =
        vehicleData.make || "";

      const model =
        vehicleData.model || "";

      quoteMakeModel.textContent =
        [make, model]
          .filter(Boolean)
          .join(" / ") || "—";

    }

    if(quoteFuel){

      quoteFuel.textContent =
        vehicleData.fuelType ||
        "—";

    }

    if(quoteYear){

      quoteYear.textContent =
        vehicleData.manufacturingYear ||
        "—";

    }

    if(quoteNCB){

      quoteNCB.textContent =
        vehicleData.ncb ||
        "—";

    }


    showToast(
      `Quote ${quoteId} generated successfully.`
    );

    if(quoteEngineSection){

      quoteEngineSection.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });

    }

    console.log(
      "Insurance Hub Generated Quote:",
      window.insuranceHubQuote
    );

  });

}


/* =========================
   SAVE QUOTE — DEMO
   ========================= */

if(saveQuoteBtn){

  saveQuoteBtn.addEventListener("click", () => {

    if(!window.insuranceHubQuote){

      showToast(
        "Generate a quote first."
      );

      return;

    }


    try{

      localStorage.setItem(
        "insuranceHubDemoQuote",
        JSON.stringify(
          window.insuranceHubQuote
        )
      );

      showToast(
        `Quote ${window.insuranceHubQuote.quoteId} saved on this device.`
      );

    }catch(error){

      console.error(
        "Quote save failed:",
        error
      );

      showToast(
        "Unable to save the demo quote."
      );

    }

  });

}


/* =========================================================
   COMPARE PLANS — SELECTION & COMPARISON
   ========================================================= */

const comparePlanPicker =
  $("#comparePlanPicker");

const compareCount =
  $("#compareCount");

const compareClearBtn =
  $("#compareClearBtn");

const compareTableWrap =
  $("#compareTableWrap");

const compareTableHead =
  $("#compareTableHead");

const compareTableBody =
  $("#compareTableBody");

const compareContinueBtn =
  $("#compareContinueBtn");

const comparePickerCards =
  comparePlanPicker
    ? $$(".compare-picker-card", comparePlanPicker)
    : [];

let selectedComparePlans = [];

const comparePlanData = {
  "plan-01": {
    name: "Secure Drive Plus",
    insurer: "Demo Insurer A",
    premium: 12499,
    coverage: "Comprehensive motor cover",
    benefits: "Own damage + third-party cover + roadside assistance",
    deductible: "₹1,000",
    waiting: "Standard policy terms",
    exclusions: "Wear and tear, illegal use, excluded consequential loss",
    addons: "Roadside Assistance, Zero Depreciation",
    terms: "1 year own-damage cover + applicable third-party period"
  },

  "plan-02": {
    name: "Motor Protect Elite",
    insurer: "Demo Insurer B",
    premium: 14999,
    coverage: "Comprehensive motor cover with enhanced protection",
    benefits: "Own damage + third-party cover + emergency assistance",
    deductible: "₹1,000",
    waiting: "Standard policy terms",
    exclusions: "Wear and tear, illegal use, excluded consequential loss",
    addons: "Zero Depreciation, Engine Protection, Roadside Assistance",
    terms: "1 year indicative demo policy term"
  },

  "plan-03": {
    name: "Smart Motor Shield",
    insurer: "Demo Insurer C",
    premium: 10999,
    coverage: "Comprehensive motor cover",
    benefits: "Own damage + third-party cover + selected assistance benefits",
    deductible: "₹1,500",
    waiting: "Standard policy terms",
    exclusions: "Wear and tear, illegal use, excluded consequential loss",
    addons: "Roadside Assistance",
    terms: "1 year indicative demo policy term"
  }
};

function updateCompareCount(){
  if(compareCount){
    compareCount.textContent =
      String(selectedComparePlans.length);
  }

  if(compareContinueBtn){
    compareContinueBtn.disabled =
      selectedComparePlans.length < 1;
  }
}

function renderCompareTable(){

  if(!compareTableHead ||
     !compareTableBody ||
     !compareTableWrap){
    return;
  }

  if(selectedComparePlans.length < 2){
    compareTableWrap.hidden = true;
    compareTableHead.innerHTML =
      "<tr><th>Feature</th></tr>";
    compareTableBody.innerHTML = "";
    return;
  }

  compareTableWrap.hidden = false;

  const plans =
    selectedComparePlans
      .map(id => comparePlanData[id])
      .filter(Boolean);

  compareTableHead.innerHTML =
    "<tr><th>Feature</th>" +
    plans.map(plan =>
      `<th>${plan.name}<br><small>${plan.insurer}</small></th>`
    ).join("") +
    "</tr>";

  const rows = [
    ["Premium", plan => `<span class="compare-premium">₹${Number(plan.premium).toLocaleString("en-IN")}</span>`],
    ["Coverage", plan => plan.coverage],
    ["Benefits", plan => plan.benefits],
    ["Deductible", plan => plan.deductible],
    ["Waiting Period", plan => plan.waiting],
    ["Exclusions", plan => plan.exclusions],
    ["Add-ons", plan => plan.addons],
    ["Policy Terms", plan => plan.terms]
  ];

  compareTableBody.innerHTML =
    rows.map(([label, getter]) =>
      `<tr>
        <th scope="row">${label}</th>
        ${plans.map(plan => `<td>${getter(plan)}</td>`).join("")}
      </tr>`
    ).join("");

  compareTableWrap.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function toggleComparePlan(card, checkbox){

  const planId =
    card.dataset.comparePlan || "";

  if(!planId){
    return;
  }

  const alreadySelected =
    selectedComparePlans.includes(planId);

  if(checkbox.checked && !alreadySelected){

    if(selectedComparePlans.length >= 4){
      checkbox.checked = false;

      showToast(
        "You can compare a maximum of 4 plans."
      );

      return;
    }

    selectedComparePlans.push(planId);
    card.classList.add("compare-selected");

  }else if(!checkbox.checked && alreadySelected){

    selectedComparePlans =
      selectedComparePlans.filter(
        id => id !== planId
      );

    card.classList.remove("compare-selected");
  }

  updateCompareCount();
  renderCompareTable();

  if(selectedComparePlans.length === 1){
    showToast(
      "Select at least one more plan to compare."
    );
  }

  if(selectedComparePlans.length >= 2){
    showToast(
      `${selectedComparePlans.length} plans ready for comparison.`
    );
  }
}

comparePickerCards.forEach(card => {

  const checkbox =
    $("[data-compare-checkbox]", card);

  if(checkbox){
    checkbox.addEventListener(
      "change",
      event => {
        event.stopPropagation();
        toggleComparePlan(
          card,
          checkbox
        );
      }
    );
  }

  card.addEventListener("click", event => {

    if(
      event.target.closest("label") ||
      event.target.matches("input")
    ){
      return;
    }

    if(!checkbox){
      return;
    }

    checkbox.checked =
      !checkbox.checked;

    toggleComparePlan(
      card,
      checkbox
    );
  });
});

if(compareClearBtn){
  compareClearBtn.addEventListener(
    "click",
    () => {

      selectedComparePlans = [];

      comparePickerCards.forEach(card => {

        card.classList.remove(
          "compare-selected"
        );

        const checkbox =
          $("[data-compare-checkbox]", card);

        if(checkbox){
          checkbox.checked = false;
        }
      });

      updateCompareCount();
      renderCompareTable();

      showToast(
        "Compare selection cleared."
      );
    }
  );
}

if(compareContinueBtn){
  compareContinueBtn.addEventListener(
    "click",
    () => {

      if(selectedComparePlans.length === 0){
        showToast(
          "Please select a plan first."
        );
        return;
      }

      const planId =
        selectedComparePlans[0];

      const plan =
        comparePlanData[planId];

      if(!plan){
        showToast(
          "Selected plan data is unavailable."
        );
        return;
      }

      window.insuranceHubSelectedComparePlan = {
        id: planId,
        name: plan.name,
        insurer: plan.insurer,
        premium: plan.premium
      };

      showToast(
        `${plan.name} selected for the next step.`
      );

      console.log(
        "Insurance Hub Compare Selection:",
        window.insuranceHubSelectedComparePlan
      );
    }
  );
}

updateCompareCount();


/* =========================================================
   PURCHASE FLOW — PROPOSAL LOGIC
   ========================================================= */

const purchaseForm =
  $("#purchaseForm");

const purchaseSuccessPanel =
  $("#purchaseSuccessPanel");

const purchaseSuccessText =
  $("#purchaseSuccessText");

const purchasePlanName =
  $("#purchasePlanName");

const purchasePlanMeta =
  $("#purchasePlanMeta");

const purchasePlanPremium =
  $("#purchasePlanPremium");

const purchaseKycSummary =
  $("#purchaseKycSummary");

const kycStatus =
  $("#kycStatus");

const proposalDocument =
  $("#proposalDocument");

const purchaseConsent =
  $("#purchaseConsent");

const purchaseReviewBtn =
  $("#purchaseReviewBtn");

function getPurchasePlan(){

  const comparedPlan =
    window.insuranceHubSelectedComparePlan;

  if(comparedPlan){
    return comparedPlan;
  }

  const quote =
    window.insuranceHubQuote;

  if(quote){
    return {
      id: quote.planId || "",
      name: quote.planName || "Selected Plan",
      insurer: quote.insurer || "Demo Insurer",
      premium:
        Number(
          quote.total ||
          quote.indicativePremium ||
          quote.premium ||
          0
        )
    };
  }

  return null;
}

function updatePurchasePlanSummary(){

  const plan =
    getPurchasePlan();

  if(!plan){
    return;
  }

  if(purchasePlanName){
    purchasePlanName.textContent =
      plan.name || "Selected Plan";
  }

  if(purchasePlanMeta){
    purchasePlanMeta.textContent =
      `${plan.insurer || "Demo Insurer"} • Demo/sample plan`;
  }

  if(purchasePlanPremium){
    purchasePlanPremium.textContent =
      `₹${Number(plan.premium || 0).toLocaleString("en-IN")}`;
  }
}

updatePurchasePlanSummary();

if(proposalDocument){

  proposalDocument.addEventListener(
    "change",
    () => {

      const file =
        proposalDocument.files?.[0];

      if(file){

        if(kycStatus){
          kycStatus.textContent =
            "Document selected — pending verification";
        }

        if(purchaseKycSummary){
          purchaseKycSummary.textContent =
            "Document Added";
        }

        showToast(
          `${file.name} selected for demo upload.`
        );

      }else{

        if(kycStatus){
          kycStatus.textContent =
            "Pending verification";
        }

        if(purchaseKycSummary){
          purchaseKycSummary.textContent =
            "Pending";
        }
      }
    }
  );
}

function clearPurchaseFieldError(field){

  if(!field){
    return;
  }

  field.classList.remove(
    "field-error"
  );

  field.removeAttribute(
    "aria-invalid"
  );
}

function markPurchaseFieldError(field){

  if(!field){
    return;
  }

  field.classList.add(
    "field-error"
  );

  field.setAttribute(
    "aria-invalid",
    "true"
  );
}

if(purchaseForm){

  const purchaseFields =
    $$(
      "input, select, textarea",
      purchaseForm
    );

  purchaseFields.forEach(field => {

    field.addEventListener(
      "input",
      () => clearPurchaseFieldError(field)
    );

    field.addEventListener(
      "change",
      () => clearPurchaseFieldError(field)
    );
  });

  purchaseForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      let firstInvalid = null;

      purchaseFields.forEach(field => {

        clearPurchaseFieldError(field);

        if(
          field.required &&
          field.type !== "file" &&
          !field.value.trim()
        ){

          markPurchaseFieldError(
            field
          );

          if(!firstInvalid){
            firstInvalid = field;
          }
        }

        if(
          field.type === "tel" &&
          field.value.trim() &&
          !/^\d{10}$/.test(
            field.value.trim()
          )
        ){

          markPurchaseFieldError(
            field
          );

          if(!firstInvalid){
            firstInvalid = field;
          }
        }

        if(
          field.id === "customerPincode" &&
          field.value.trim() &&
          !/^\d{6}$/.test(
            field.value.trim()
          )
        ){

          markPurchaseFieldError(
            field
          );

          if(!firstInvalid){
            firstInvalid = field;
          }
        }
      });

      if(firstInvalid){

        showToast(
          "Please complete the required proposal details."
        );

        firstInvalid.focus();
        return;
      }

      const formData =
        new FormData(
          purchaseForm
        );

      const plan =
        getPurchasePlan();

      const proposalId =
        `PROP-${Date.now().toString().slice(-8)}`;

      const proposalData = {

        proposalId,

        plan: plan
          ? {
              id: plan.id || "",
              name: plan.name || "",
              insurer: plan.insurer || "",
              premium:
                Number(
                  plan.premium || 0
                )
            }
          : null,

        customer: {
          name:
            formData.get("customerName") || "",
          dob:
            formData.get("customerDob") || "",
          gender:
            formData.get("customerGender") || "",
          mobile:
            formData.get("customerMobile") || "",
          email:
            formData.get("customerEmail") || "",
          pincode:
            formData.get("customerPincode") || "",
          address:
            formData.get("customerAddress") || ""
        },

        nominee: {
          name:
            formData.get("nomineeName") || "",
          relation:
            formData.get("nomineeRelation") || "",
          dob:
            formData.get("nomineeDob") || "",
          mobile:
            formData.get("nomineeMobile") || ""
        },

        kycStatus:
          proposalDocument?.files?.length
            ? "DOCUMENT_SELECTED"
            : "PENDING",

        consent:
          purchaseConsent?.checked === true,

        createdAt:
          new Date().toISOString(),

        status:
          "DEMO_REVIEW"
      };

      window.insuranceHubProposal =
        proposalData;

      try{

        localStorage.setItem(
          "insuranceHubDemoProposal",
          JSON.stringify(
            proposalData
          )
        );

      }catch(error){

        console.error(
          "Proposal local save failed:",
          error
        );
      }

      if(purchaseSuccessPanel){
        purchaseSuccessPanel.hidden =
          false;
      }

      if(purchaseSuccessText){

        purchaseSuccessText.textContent =
          `Proposal ${proposalId} is ready for review. Demo data has been saved on this device.`;
      }

      if(purchaseReviewBtn){

        purchaseReviewBtn.textContent =
          "Proposal Ready ✓";

        purchaseReviewBtn.disabled =
          true;
      }

      showToast(
        `Proposal ${proposalId} created successfully.`
      );

      console.log(
        "Insurance Hub Demo Proposal:",
        window.insuranceHubProposal
      );
    }
  );
}


/* =========================================================
   PAYMENT MODULE — DEMO PAYMENT LOGIC
   ========================================================= */

const paymentMethodGrid =
  $("#paymentMethodGrid");

const paymentMethodCards =
  paymentMethodGrid
    ? $$(".payment-method-card", paymentMethodGrid)
    : [];

const paymentSelectedMethod =
  $("#paymentSelectedMethod");

const paymentMethodHint =
  $("#paymentMethodHint");

const upiPaymentField =
  $("#upiPaymentField");

const cardPaymentFields =
  $("#cardPaymentFields");

const bankPaymentField =
  $("#bankPaymentField");

const upiId =
  $("#upiId");

const cardNumber =
  $("#cardNumber");

const cardExpiry =
  $("#cardExpiry");

const cardCvv =
  $("#cardCvv");

const bankName =
  $("#bankName");

const payNowBtn =
  $("#payNowBtn");

const paymentPlanName =
  $("#paymentPlanName");

const paymentPlanNameSmall =
  $("#paymentPlanNameSmall");

const paymentBasePremium =
  $("#paymentBasePremium");

const paymentTax =
  $("#paymentTax");

const paymentTotal =
  $("#paymentTotal");

const paymentTransactionBox =
  $("#paymentTransactionBox");

const paymentTransactionId =
  $("#paymentTransactionId");

const paymentTransactionStatus =
  $("#paymentTransactionStatus");

const paymentSuccessPanel =
  $("#paymentSuccessPanel");

const paymentSuccessText =
  $("#paymentSuccessText");

let selectedPaymentMethod =
  "UPI";

let paymentProcessing =
  false;

function getPaymentPlan(){

  const proposal =
    window.insuranceHubProposal;

  if(proposal?.plan){
    return proposal.plan;
  }

  const comparedPlan =
    window.insuranceHubSelectedComparePlan;

  if(comparedPlan){
    return comparedPlan;
  }

  const quote =
    window.insuranceHubQuote;

  if(quote){
    return {
      id:
        quote.planId || "",
      name:
        quote.planName || "Selected Plan",
      insurer:
        quote.insurer || "Demo Insurer",
      premium:
        Number(
          quote.total ||
          quote.indicativePremium ||
          quote.premium ||
          0
        )
    };
  }

  return null;
}

function formatPaymentCurrency(value){
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function updatePaymentSummary(){

  const plan =
    getPaymentPlan();

  if(!plan){
    return;
  }

  const premium =
    Number(plan.premium || 0);

  const tax =
    Math.round(premium * 0.18);

  const total =
    premium + tax;

  if(paymentPlanName){
    paymentPlanName.textContent =
      plan.name || "Selected Plan";
  }

  if(paymentPlanNameSmall){
    paymentPlanNameSmall.textContent =
      plan.name || "—";
  }

  if(paymentBasePremium){
    paymentBasePremium.textContent =
      formatPaymentCurrency(premium);
  }

  if(paymentTax){
    paymentTax.textContent =
      formatPaymentCurrency(tax);
  }

  if(paymentTotal){
    paymentTotal.textContent =
      formatPaymentCurrency(total);
  }
}

function updatePaymentMethodUI(){

  paymentMethodCards.forEach(card => {

    const method =
      card.dataset.paymentMethod || "";

    const active =
      method === selectedPaymentMethod;

    card.classList.toggle(
      "active",
      active
    );

    card.setAttribute(
      "aria-pressed",
      String(active)
    );
  });

  if(paymentSelectedMethod){
    paymentSelectedMethod.textContent =
      selectedPaymentMethod;
  }

  if(upiPaymentField){
    upiPaymentField.hidden =
      selectedPaymentMethod !== "UPI";
  }

  if(cardPaymentFields){
    cardPaymentFields.hidden =
      ![
        "Credit Card",
        "Debit Card"
      ].includes(
        selectedPaymentMethod
      );
  }

  if(bankPaymentField){
    bankPaymentField.hidden =
      selectedPaymentMethod !== "Net Banking";
  }

  if(paymentMethodHint){

    const hints = {
      "UPI":
        "Enter a demo UPI ID to continue.",
      "Credit Card":
        "Enter demo card details. Do not use a real card.",
      "Debit Card":
        "Enter demo card details. Do not use a real card.",
      "Net Banking":
        "Select a demo bank to continue."
    };

    paymentMethodHint.textContent =
      hints[selectedPaymentMethod] ||
      "Choose a payment method to continue.";
  }
}

paymentMethodCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      if(paymentProcessing){
        return;
      }

      selectedPaymentMethod =
        card.dataset.paymentMethod ||
        "UPI";

      updatePaymentMethodUI();

      showToast(
        `${selectedPaymentMethod} selected.`
      );
    }
  );
});

function clearPaymentFieldError(field){

  if(!field){
    return;
  }

  field.classList.remove(
    "field-error"
  );

  field.removeAttribute(
    "aria-invalid"
  );
}

function markPaymentFieldError(field){

  if(!field){
    return;
  }

  field.classList.add(
    "field-error"
  );

  field.setAttribute(
    "aria-invalid",
    "true"
  );
}

[
  upiId,
  cardNumber,
  cardExpiry,
  cardCvv,
  bankName
].forEach(field => {

  if(!field){
    return;
  }

  field.addEventListener(
    "input",
    () => clearPaymentFieldError(field)
  );

  field.addEventListener(
    "change",
    () => clearPaymentFieldError(field)
  );
});

function validatePaymentMethod(){

  [
    upiId,
    cardNumber,
    cardExpiry,
    cardCvv,
    bankName
  ].forEach(field => {
    clearPaymentFieldError(field);
  });

  let firstInvalid =
    null;

  if(selectedPaymentMethod === "UPI"){

    const value =
      upiId?.value.trim() || "";

    if(
      !value ||
      !/^[^@\s]+@[^@\s]+$/.test(value)
    ){

      markPaymentFieldError(
        upiId
      );

      firstInvalid =
        upiId;
    }
  }

  if(
    selectedPaymentMethod === "Credit Card" ||
    selectedPaymentMethod === "Debit Card"
  ){

    const number =
      cardNumber?.value
        .replace(/\s/g,"")
        .trim() || "";

    const expiry =
      cardExpiry?.value.trim() || "";

    const cvv =
      cardCvv?.value.trim() || "";

    if(
      !/^\d{12,19}$/.test(number)
    ){

      markPaymentFieldError(
        cardNumber
      );

      firstInvalid =
        cardNumber;
    }

    if(
      !firstInvalid &&
      !/^\d{2}\/\d{2}$/.test(expiry)
    ){

      markPaymentFieldError(
        cardExpiry
      );

      firstInvalid =
        cardExpiry;
    }

    if(
      !firstInvalid &&
      !/^\d{3,4}$/.test(cvv)
    ){

      markPaymentFieldError(
        cardCvv
      );

      firstInvalid =
        cardCvv;
    }
  }

  if(selectedPaymentMethod === "Net Banking"){

    if(!bankName?.value){

      markPaymentFieldError(
        bankName
      );

      firstInvalid =
        bankName;
    }
  }

  if(firstInvalid){

    showToast(
      "Please enter valid demo payment details."
    );

    firstInvalid.focus();

    return false;
  }

  return true;
}

if(payNowBtn){

  payNowBtn.addEventListener(
    "click",
    () => {

      if(paymentProcessing){
        return;
      }

      const plan =
        getPaymentPlan();

      if(!plan){

        showToast(
          "Please select a plan before payment."
        );

        return;
      }

      if(!validatePaymentMethod()){
        return;
      }

      const premium =
        Number(plan.premium || 0);

      const tax =
        Math.round(
          premium * 0.18
        );

      const total =
        premium + tax;

      paymentProcessing =
        true;

      payNowBtn.disabled =
        true;

      payNowBtn.textContent =
        "Processing…";

      showToast(
        "Processing demo payment…"
      );

      setTimeout(() => {

        const transactionId =
          `TXN-${Date.now().toString().slice(-10)}`;

        const paymentData = {

          transactionId,

          paymentMethod:
            selectedPaymentMethod,

          plan: {
            id:
              plan.id || "",
            name:
              plan.name || "",
            insurer:
              plan.insurer || "",
            premium
          },

          basePremium:
            premium,

          tax,

          total,

          status:
            "SUCCESS",

          demo:
            true,

          createdAt:
            new Date().toISOString()
        };

        window.insuranceHubPayment =
          paymentData;

        try{

          localStorage.setItem(
            "insuranceHubDemoPayment",
            JSON.stringify(
              paymentData
            )
          );

        }catch(error){

          console.error(
            "Payment local save failed:",
            error
          );
        }

        if(paymentTransactionId){
          paymentTransactionId.textContent =
            transactionId;
        }

        if(paymentTransactionStatus){
          paymentTransactionStatus.textContent =
            `SUCCESS • ${selectedPaymentMethod}`;
        }

        if(paymentTransactionBox){
          paymentTransactionBox.hidden =
            false;
        }

        if(paymentSuccessPanel){
          paymentSuccessPanel.hidden =
            false;
        }

        if(paymentSuccessText){
          paymentSuccessText.textContent =
            `Demo payment ${transactionId} recorded successfully for ${formatPaymentCurrency(total)}. No real money was charged.`;
        }

        payNowBtn.textContent =
          "Payment Successful ✓";

        showToast(
          `Payment ${transactionId} successful.`
        );

        paymentProcessing =
          false;

        console.log(
          "Insurance Hub Demo Payment:",
          window.insuranceHubPayment
        );

      }, 900);
    }
  );
}

updatePaymentSummary();
updatePaymentMethodUI();



/* PHASE1_CUSTOMER_PLATFORM_JS */

/* PHASE1_CUSTOMER_PLATFORM_JS */
(() => {
  const accountName = $("#accountName");
  const accountMobile = $("#accountMobile");
  const accountEmail = $("#accountEmail");
  const sendOtpBtn = $("#sendOtpBtn");
  const verifyOtpBtn = $("#verifyOtpBtn");
  const accountOtp = $("#accountOtp");
  const otpDemoBox = $("#otpDemoBox");
  const demoOtpValue = $("#demoOtpValue");
  const otpVerifyArea = $("#otpVerifyArea");
  const loginStatus = $("#loginStatus");
  const accountStatusBadge = $("#accountStatusBadge");
  const profileStatus = $("#profileStatus");
  const profileDisplayName = $("#profileDisplayName");
  const profileDisplayContact = $("#profileDisplayContact");
  const profileAvatar = $("#profileAvatar");
  const saveProfileBtn = $("#saveProfileBtn");

  const claimPolicyRef = $("#claimPolicyRef");
  const claimType = $("#claimType");
  const claimDescription = $("#claimDescription");
  const submitClaimBtn = $("#submitClaimBtn");
  const claimStatusTitle = $("#claimStatusTitle");
  const claimReference = $("#claimReference");
  const claimTimeline = $("#claimTimeline");
  const renewalNextAction = $("#renewalNextAction");
  const renewalNextMeta = $("#renewalNextMeta");
  const renewalRefreshBtn = $("#renewalRefreshBtn");

  let demoOtp = "";
  let customerLoggedIn = false;

  const safeParse = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Insurance Hub storage read failed: ${key}`, error);
      return fallback;
    }
  };

  const escapeHTML = (value) => {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  };

  const saveLocal = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Insurance Hub storage write failed: ${key}`, error);
      return false;
    }
  };

  const getProfile = () => safeParse("insuranceHubCustomerProfile", null);

  const getQuoteRecords = () => {
    const records = [];
    const quote = safeParse("insuranceHubDemoQuote", null);
    if (quote) records.push(quote);
    if (window.insuranceHubQuote &&
        !records.some(item => item.quoteId === window.insuranceHubQuote.quoteId)) {
      records.push(window.insuranceHubQuote);
    }
    return records;
  };

  const getPaymentRecords = () => {
    const records = [];
    const payment = safeParse("insuranceHubDemoPayment", null);
    if (payment) records.push(payment);
    if (window.insuranceHubPayment &&
        !records.some(item => item.transactionId === window.insuranceHubPayment.transactionId)) {
      records.push(window.insuranceHubPayment);
    }
    return records;
  };

  const getApplicationRecords = () => {
    const proposal = window.insuranceHubProposal;
    if (!proposal) return [];
    return [proposal];
  };

  const getPolicyRecords = () => {
    const policies = safeParse("insuranceHubDemoPolicies", []);
    return Array.isArray(policies) ? policies : [];
  };

  const getDocumentRecords = () => {
    const documents = safeParse("insuranceHubDemoDocuments", []);
    return Array.isArray(documents) ? documents : [];
  };

  const getClaimRecords = () => {
    const claims = safeParse("insuranceHubDemoClaims", []);
    return Array.isArray(claims) ? claims : [];
  };

  const setCount = (id, count) => {
    const node = $(id);
    if (node) node.textContent = String(count);
  };

  const renderList = (selector, items, emptyText, mapper) => {
    const container = $(selector);
    if (!container) return;

    if (!items.length) {
      container.innerHTML = `<div class="workspace-empty">${escapeHTML(emptyText)}</div>`;
      return;
    }

    container.innerHTML = items.map(mapper).join("");
  };

  const updateCustomerDashboard = () => {
    const quotes = getQuoteRecords();
    const applications = getApplicationRecords();
    const payments = getPaymentRecords();
    const policies = getPolicyRecords();
    const documents = getDocumentRecords();
    const claims = getClaimRecords();

    setCount("#accountQuotesCount", quotes.length);
    setCount("#accountApplicationsCount", applications.length);
    setCount("#accountPoliciesCount", policies.length);
    setCount("#accountPaymentsCount", payments.length);
    setCount("#accountDocumentsCount", documents.length);
    setCount("#accountClaimsCount", claims.length);

    setCount("#quoteWorkspaceCount", quotes.length);
    setCount("#applicationWorkspaceCount", applications.length);
    setCount("#policyWorkspaceCount", policies.length);
    setCount("#paymentWorkspaceCount", payments.length);
    setCount("#documentWorkspaceCount", documents.length);

    renderList(
      "#customerQuotesList",
      quotes,
      "No saved demo quote yet.",
      quote => `
        <div class="workspace-item">
          <div class="workspace-item-main">
            <strong>${escapeHTML(quote.planName || "Insurance Quote")}</strong>
            <span>${escapeHTML(quote.quoteId || "Demo quote")} • ${escapeHTML(quote.vehicleType || "Vehicle")}</span>
          </div>
          <span class="workspace-item-value">₹${Number(quote.total || quote.indicativePremium || 0).toLocaleString("en-IN")}</span>
        </div>
      `
    );

    renderList(
      "#customerApplicationsList",
      applications,
      "No proposal application yet.",
      proposal => `
        <div class="workspace-item">
          <div class="workspace-item-main">
            <strong>${escapeHTML(proposal.plan?.name || "Insurance Application")}</strong>
            <span>${escapeHTML(proposal.applicationId || "Demo application")} • ${escapeHTML(proposal.status || "REVIEW")}</span>
          </div>
          <span class="workspace-item-value">APPLICATION</span>
        </div>
      `
    );

    renderList(
      "#customerPoliciesList",
      policies,
      "No active demo policy yet.",
      policy => `
        <div class="workspace-item">
          <div class="workspace-item-main">
            <strong>${escapeHTML(policy.planName || "Demo Policy")}</strong>
            <span>${escapeHTML(policy.policyNumber || "Policy pending")} • ${escapeHTML(policy.status || "ACTIVE")}</span>
          </div>
          <span class="workspace-item-value">${escapeHTML(policy.expiry || "—")}</span>
        </div>
      `
    );

    renderList(
      "#customerPaymentsList",
      payments,
      "No demo payment transaction yet.",
      payment => `
        <div class="workspace-item">
          <div class="workspace-item-main">
            <strong>${escapeHTML(payment.transactionId || "Demo transaction")}</strong>
            <span>${escapeHTML(payment.paymentMethod || "Payment")} • ${escapeHTML(payment.status || "SUCCESS")}</span>
          </div>
          <span class="workspace-item-value">₹${Number(payment.total || 0).toLocaleString("en-IN")}</span>
        </div>
      `
    );

    renderList(
      "#customerDocumentsList",
      documents,
      "Documents uploaded in later modules will appear here.",
      documentItem => `
        <div class="workspace-item">
          <div class="workspace-item-main">
            <strong>${escapeHTML(documentItem.name || "Demo Document")}</strong>
            <span>${escapeHTML(documentItem.type || "Document")}</span>
          </div>
          <span class="workspace-item-value">LOCAL</span>
        </div>
      `
    );

    const policiesForRenewal = policies.filter(policy => policy.expiry);
    if (policiesForRenewal.length) {
      const next = policiesForRenewal[0];
      if (renewalNextAction) {
        renewalNextAction.textContent = next.planName || "Policy Renewal";
      }
      if (renewalNextMeta) {
        renewalNextMeta.textContent =
          `Renewal date: ${next.expiry}. Review your policy before expiry.`;
      }
    } else {
      if (renewalNextAction) renewalNextAction.textContent = "No renewal scheduled";
      if (renewalNextMeta) {
        renewalNextMeta.textContent =
          "Complete a demo purchase to create a policy record.";
      }
    }

    renderClaimStatus(claims[0] || null);
  };

  const updateProfileUI = () => {
    const profile = getProfile();

    if (!profile) {
      if (loginStatus) loginStatus.textContent = "Guest";
      if (profileStatus) profileStatus.textContent = "Not saved";
      if (profileDisplayName) profileDisplayName.textContent = "Guest Customer";
      if (profileDisplayContact) {
        profileDisplayContact.textContent = "Login to activate your profile";
      }
      if (profileAvatar) profileAvatar.textContent = "IH";
      if (accountStatusBadge) accountStatusBadge.textContent = "DEMO ACCOUNT";
      return;
    }

    if (accountName) accountName.value = profile.name || "";
    if (accountMobile) accountMobile.value = profile.mobile || "";
    if (accountEmail) accountEmail.value = profile.email || "";

    if (loginStatus) loginStatus.textContent = "Verified";
    if (profileStatus) profileStatus.textContent = "Saved";
    if (profileDisplayName) profileDisplayName.textContent = profile.name || "Customer";
    if (profileDisplayContact) {
      profileDisplayContact.textContent =
        profile.mobile || profile.email || "Profile active";
    }
    if (profileAvatar) {
      const initials = String(profile.name || "IH")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase();
      profileAvatar.textContent = initials || "IH";
    }
    if (accountStatusBadge) accountStatusBadge.textContent = "CUSTOMER ACTIVE";
    customerLoggedIn = true;
  };

  const generateDemoOtp = () => {
    demoOtp = String(Math.floor(100000 + Math.random() * 900000));
    if (demoOtpValue) demoOtpValue.textContent = demoOtp;
    if (otpDemoBox) otpDemoBox.hidden = false;
    if (otpVerifyArea) otpVerifyArea.hidden = false;
    showToast("Demo OTP generated. Use the code shown in the account card.");
  };

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
      const mobile = accountMobile?.value.trim() || "";

      if (!/^\d{10}$/.test(mobile)) {
        showToast("Enter a valid 10-digit mobile number first.");
        accountMobile?.focus();
        return;
      }

      generateDemoOtp();
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener("click", () => {
      const entered = accountOtp?.value.trim() || "";

      if (!demoOtp) {
        showToast("Generate the demo OTP first.");
        return;
      }

      if (entered !== demoOtp) {
        showToast("Incorrect demo OTP.");
        accountOtp?.focus();
        return;
      }

      customerLoggedIn = true;

      const profile = {
        name: accountName?.value.trim() || "Customer",
        mobile: accountMobile?.value.trim() || "",
        email: accountEmail?.value.trim() || "",
        verified: true,
        updatedAt: new Date().toISOString()
      };

      saveLocal("insuranceHubCustomerProfile", profile);
      updateProfileUI();
      showToast("Demo customer login verified.");
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      const name = accountName?.value.trim() || "";
      const mobile = accountMobile?.value.trim() || "";
      const email = accountEmail?.value.trim() || "";

      if (!name) {
        showToast("Enter your name first.");
        accountName?.focus();
        return;
      }

      if (mobile && !/^\d{10}$/.test(mobile)) {
        showToast("Mobile number must contain 10 digits.");
        accountMobile?.focus();
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Enter a valid email address.");
        accountEmail?.focus();
        return;
      }

      saveLocal("insuranceHubCustomerProfile", {
        name,
        mobile,
        email,
        verified: customerLoggedIn,
        updatedAt: new Date().toISOString()
      });

      updateProfileUI();
      showToast("Customer profile saved on this device.");
    });
  }

  const createDemoPolicyFromPayment = () => {
    const payment = window.insuranceHubPayment || safeParse("insuranceHubDemoPayment", null);
    if (!payment) return;

    const existing = getPolicyRecords();

    if (existing.some(policy => policy.transactionId === payment.transactionId)) {
      return;
    }

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const policy = {
      policyNumber: `IH-POL-${Date.now().toString().slice(-8)}`,
      transactionId: payment.transactionId,
      planName: payment.plan?.name || "Demo Insurance Plan",
      insurer: payment.plan?.insurer || "Demo Insurer",
      premium: payment.total || 0,
      status: "DEMO ACTIVE",
      startDate: new Date().toISOString().slice(0, 10),
      expiry: expiryDate.toISOString().slice(0, 10)
    };

    existing.push(policy);
    saveLocal("insuranceHubDemoPolicies", existing);
  };

  const renderClaimStatus = claim => {
    if (!claim) {
      if (claimStatusTitle) claimStatusTitle.textContent = "No claim submitted";
      if (claimReference) claimReference.textContent = "—";
      return;
    }

    if (claimStatusTitle) claimStatusTitle.textContent = claim.type || "Demo Claim";
    if (claimReference) claimReference.textContent = claim.reference || "IH-CLM";

    const steps = claimTimeline ? $$(".claim-step", claimTimeline) : [];
    const currentStep = Number(claim.currentStep || 1);

    steps.forEach((step, index) => {
      step.classList.toggle("active", index < currentStep);
    });
  };

  if (submitClaimBtn) {
    submitClaimBtn.addEventListener("click", () => {
      const policyRef = claimPolicyRef?.value.trim() || "";
      const type = claimType?.value || "";
      const description = claimDescription?.value.trim() || "";

      if (!policyRef || !type || !description) {
        showToast("Complete all claim fields first.");
        return;
      }

      const claims = getClaimRecords();

      const claim = {
        reference: `IH-CLM-${Date.now().toString().slice(-8)}`,
        policyRef,
        type,
        description,
        currentStep: 1,
        status: "INITIATED",
        createdAt: new Date().toISOString()
      };

      claims.unshift(claim);
      saveLocal("insuranceHubDemoClaims", claims);

      if (claimPolicyRef) claimPolicyRef.value = "";
      if (claimType) claimType.value = "";
      if (claimDescription) claimDescription.value = "";

      updateCustomerDashboard();
      showToast(`Demo claim ${claim.reference} created.`);
    });
  }

  if (renewalRefreshBtn) {
    renewalRefreshBtn.addEventListener("click", () => {
      updateCustomerDashboard();
      showToast("Renewal status refreshed.");
    });
  }

  $$("[data-account-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.accountTarget || "";
      const map = {
        quotes: "#customerQuotesPanel",
        applications: "#customerApplicationsPanel",
        policies: "#customerPoliciesPanel",
        payments: "#customerPaymentsPanel",
        documents: "#customerDocumentsPanel",
        claims: "#claims"
      };

      const node = $(map[target]);
      if (node) {
        node.scrollIntoView({behavior: "smooth", block: "center"});
      }
    });
  });

  document.addEventListener("insuranceHubPaymentSuccess", () => {
    createDemoPolicyFromPayment();
    updateCustomerDashboard();
  });

  const originalPaymentStorage = localStorage.getItem("insuranceHubDemoPayment");
  if (originalPaymentStorage) {
    createDemoPolicyFromPayment();
  }

  updateProfileUI();
  updateCustomerDashboard();
})();


/* PHASE1_WHATSAPP_LAYER_JS */
(() => {
  /*
   * Replace only this value when the client's real WhatsApp Business
   * number is available. Use country code without + or spaces.
   *
   * Example:
   * const INSURANCE_HUB_WHATSAPP = "919876543210";
   */
  const INSURANCE_HUB_WHATSAPP = "";

  const customerWhatsAppBtn = $("#customerWhatsAppBtn");
  const leadWhatsAppBtn = $("#leadWhatsAppBtn");

  const openWhatsApp = (message) => {
    if (!INSURANCE_HUB_WHATSAPP) {
      showToast("WhatsApp Business number is not configured yet.");
      return;
    }

    const url =
      `https://wa.me/${INSURANCE_HUB_WHATSAPP}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const readLocal = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Insurance Hub WhatsApp storage read failed: ${key}`, error);
      return fallback;
    }
  };

  const getCustomerContext = () => {
    const profile = readLocal("insuranceHubCustomerProfile", null);
    const quote = readLocal("insuranceHubDemoQuote", null);
    const payment = readLocal("insuranceHubDemoPayment", null);

    return {profile, quote, payment};
  };

  if (customerWhatsAppBtn) {
    customerWhatsAppBtn.addEventListener("click", () => {
      const {profile, quote, payment} = getCustomerContext();

      const name = profile?.name || "Customer";
      const mobile = profile?.mobile || "Not provided";
      const quoteId = quote?.quoteId || "Not available";
      const plan = quote?.planName || payment?.plan?.name || "Not selected";

      const message =
`Hello Insurance Hub Support,

I need assistance with my insurance.

Customer: ${name}
Mobile: ${mobile}
Plan: ${plan}
Quote ID: ${quoteId}

Please help me with the next step.

Website: Insurance Hub`;

      openWhatsApp(message);
    });
  }

  if (leadWhatsAppBtn) {
    leadWhatsAppBtn.addEventListener("click", () => {
      const message =
`Hello Insurance Hub Team,

I am interested in insurance and would like an enquiry.

Lead Source: Insurance Hub Website
Insurance Type: Not specified
Name: Website Visitor
Mobile: Not provided

Please contact me for details and a quote.`;

      openWhatsApp(message);
    });
  }
})();
