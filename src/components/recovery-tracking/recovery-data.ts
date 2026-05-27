export type TaskCategory =
  | "physical"
  | "nutrition"
  | "baby"
  | "mental"
  | "medical"
  | "warning";

export interface RecoveryTask {
  id: string;
  category: TaskCategory;
  text: string;
  isWarning?: boolean;
}

export interface DayAdvice {
  day: number;
  adviceText: string;
  tasks: RecoveryTask[];
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  physical: "Physical Recovery",
  nutrition: "Nutrition & Hydration",
  baby: "Baby Care",
  mental: "Mental Health & Well-being",
  medical: "Medical Care & Follow-ups",
  warning: "Emergency Warning Signs",
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  physical: "#d04f51",
  nutrition: "#10b981",
  baby: "#3b82f6",
  mental: "#8b5cf6",
  medical: "#f59e0b",
  warning: "#ef4444",
};

export { CATEGORY_LABELS, CATEGORY_COLORS };

const genId = (day: number, cat: string, idx: number) =>
  `d${day}-${cat}-${idx}`;

export const getRecoveryData = (): DayAdvice[] => {
  const data: DayAdvice[] = [];

  for (let day = 1; day <= 42; day++) {
    const tasks: RecoveryTask[] = [];

    let physicalTasks = [
      "Manage pain (perineal / C-section wound care)",
      "Maintain personal hygiene (daily wash, clean pads)",
    ];

    if (day <= 7) {
      physicalTasks.unshift("Take adequate rest (short naps during the day)");
      physicalTasks.push("Check bleeding (lochia) – monitor amount & color");
      physicalTasks.push("Do light movement (walking inside house)");
      physicalTasks.push("Avoid heavy lifting");
    } else if (day <= 14) {
      physicalTasks.unshift("Balance rest and light activity");
      physicalTasks.push("Check bleeding (lochia should be lighter)");
      physicalTasks.push("Short walks outside if feeling well");
      physicalTasks.push("Perform gentle pelvic floor exercises (Kegels)");
    } else {
      physicalTasks.push("Gradually increase walking distance");
      physicalTasks.push("Perform pelvic floor exercises (Kegels) daily");
      physicalTasks.push("Monitor body for any lingering pain or issues");
    }

    physicalTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "phys", i),
        category: "physical",
        text: t,
      })
    );

    let nutritionTasks = [
      "Drink enough water (8–10 glasses daily)",
      "Eat balanced meals (rice, vegetables, protein, fruits)",
      "Avoid junk/processed food",
    ];

    if (day <= 21) {
      nutritionTasks.push(
        "Take prescribed supplements (iron, calcium, vitamins)"
      );
      nutritionTasks.push("Include iron-rich foods (green leaves, dates)");
    } else {
      nutritionTasks.push("Continue prenatal vitamins if advised");
    }

    nutritionTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "nutr", i),
        category: "nutrition",
        text: t,
      })
    );

    let babyTasks = [
      "Feed baby on demand (breastfeeding / formula)",
      "Burp baby after feeding",
    ];

    if (day <= 14) {
      babyTasks.push("Monitor baby's diaper output (wet/dirty diapers)");
      babyTasks.push("Care for the umbilical cord stump");
    } else {
      babyTasks.push("Engage in tummy time or gentle play");
      babyTasks.push("Observe baby's sleep patterns");
    }

    babyTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "baby", i),
        category: "baby",
        text: t,
      })
    );

    let mentalTasks = [
      "Monitor mood daily",
      "Talk with family/friends for support",
      "Get enough sleep when possible",
    ];

    if (day <= 14) {
      mentalTasks.push("Identify signs of 'Baby Blues' or overwhelm");
    } else {
      mentalTasks.push("Take short relaxation time (self-care)");
      mentalTasks.push("Identify signs of Postpartum Depression");
      mentalTasks.push("Practice breathing or mindfulness exercises");
    }

    mentalTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "ment", i),
        category: "mental",
        text: t,
      })
    );

    let medicalTasks: string[] = [];

    if (day <= 10) {
      medicalTasks.push("Take medications as prescribed");
      medicalTasks.push("Check wound healing (C-section/stitches)");
      medicalTasks.push("Monitor blood pressure (if needed)");
    } else if (day === 42) {
      medicalTasks.push("Attend 6-week postnatal clinic visit");
      medicalTasks.push("Discuss contraception options with doctor");
    } else {
      medicalTasks.push("Update health records in app if any clinic visits occur");
    }

    medicalTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "med", i),
        category: "medical",
        text: t,
      })
    );

    let warningTasks = [
      "Heavy bleeding (soaking pads quickly)",
      "High fever",
      "Severe abdominal pain",
      "Difficulty breathing",
      "Severe headache or blurred vision",
      "Signs of infection (bad smell, swelling)",
    ];

    warningTasks.forEach((t, i) =>
      tasks.push({
        id: genId(day, "warn", i),
        category: "warning",
        text: t,
        isWarning: true,
      })
    );

    let adviceText =
      "Focus on resting and bonding with your baby today. Listen to your body and don't hesitate to ask for help.";

    if (day === 1) {
      adviceText =
        "Welcome to Day 1! The most important thing today is resting and recovering from birth. Keep your baby close and ask for help whenever needed.";
    } else if (day === 7) {
      adviceText =
        "You've made it through the first week! It's normal to feel emotional as your hormones adjust. Continue taking things very slowly.";
    } else if (day === 14) {
      adviceText =
        "Two weeks postpartum. You might be feeling a bit more mobile, but remember you are still actively healing. Don't push yourself.";
    } else if (day === 21) {
      adviceText =
        "Week three! Bleeding should be much lighter now. Continue to prioritize hydration and nutrition to support your recovery.";
    } else if (day === 28) {
      adviceText =
        "Four weeks! You are over halfway through the traditional 6-week recovery period. You might consider adding slightly longer walks if cleared by your doctor.";
    } else if (day === 42) {
      adviceText =
        "Day 42 marks the end of the initial 6-week postpartum period. Celebrate your journey and attend your final postnatal checkup!";
    }

    data.push({
      day,
      adviceText,
      tasks,
    });
  }

  return data;
};

export const RECOVERY_DATA = getRecoveryData();