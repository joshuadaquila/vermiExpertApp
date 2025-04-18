const rules = [
  {
    condition: (data) => data.temperature > 29,
    recommendation: "Increase aeration by turning the compost regularly or using aeration pipes to lower the temperature, improve airflow, and provide oxygen for earthworms and microbes. Add moisture to the vermibed to cool it down and create a favorable environment for earthworms, ensuring the moisture level is adequate but not excessive to prevent anaerobic conditions. Provide shade using tarps, shade cloths, or shade-providing plants to reduce direct sunlight and maintain a cooler temperature. Adjust feedstock by adding materials that decompose slowly to moderate temperature spikes and avoid adding too much nitrogen-rich material at once to prevent heat generation (Zhang, Li, Zhang, & Huang, 2020).",
  },
  {
    condition: (data) => data.temperature < 21,
    recommendation: "Gradually increase the temperature by placing the vermicomposting bed in a warmer location or using heat mats, aiming for an optimal range of 21 °C to 29 °C. Insulate the bed with materials like straw bales, blankets, or tarps to retain heat, especially during colder months. Add warm materials such as fresh manure or green plant matter to boost microbial activity and generate heat. Balance moisture levels by reducing excess moisture and adding dry materials like shredded paper or cardboard if necessary (Zhang, Li, Zhang, & Huang, 2020).",
  },
  {
    condition: (data) => data.moisture > 80,
    recommendation: "Increase aeration by turning the compost pile or using aeration tools to promote evaporation and improve airflow, which helps reduce moisture levels. Add dry materials like shredded paper, cardboard, or dry leaves to absorb excess moisture and balance the content while adding carbon for microbial activity. Regularly monitor the moisture levels, aiming for a range of 40-55% for optimal vermicomposting, and take action to reduce moisture if it exceeds this range. Ensure proper drainage in the composting setup by using containers with drainage holes or creating a sloped bed to facilitate water runoff. Cover the bed with a tarp or plastic sheet if rain is causing excess moisture. Be mindful of the moisture content in the organic waste added and avoid overly wet materials, mixing in drier ones to maintain balance (Roy, Iftikar, & Chattopadhyay, 2022).",
  },
  {
    condition: (data) => data.moisture < 60,
    recommendation: "Add water to the compost bed using a spray bottle or watering can to evenly distribute moisture without flooding, aiming for a moisture content of 60-80%. Incorporate wet organic materials like kitchen scraps or freshly cut grass to raise moisture levels and add nutrients. Use moisture-retaining materials such as coconut coir or peat moss to maintain consistent moisture. Cover the bed with a tarp or cloth if exposed to wind or sun to reduce evaporation. Monitor environmental conditions, adjusting moisture management strategies for dry or windy areas. Regularly check moisture levels using a moisture meter or your hands to respond quickly to changes. Be mindful of feeding practices, avoiding overly dry materials and balancing with wetter ones to maintain optimal moisture (Roy, Iftikar, & Chattopadhyay, 2022).",
  },
  {
    condition: (data) => data.pH > 5.4,
    recommendation: "Add acidic materials like pine needles, coffee grounds, or citrus peels to lower the pH and balance levels in the vermicomposting bed. Incorporate organic matter, such as kitchen scraps or green plant materials, to help lower pH as they decompose. Maintain adequate moisture in the bed, as dry conditions can exacerbate high pH. Regularly test the pH, aiming for a range between 4.3 and 5.4 for optimal worm activity. Introduce beneficial vermicomposting microorganisms to help break down materials and lower pH. Avoid adding materials high in alkalinity, such as certain types of ash or lime, as they can raise the pH and harm microbial communities (Aslı Turp, Özdemir, Yetilmezsoy, Öz, & Elkamel, 2023).",
  },
  {
    condition: (data) => data.pH < 4.3,
    recommendation: "Add alkaline amendments like lime (calcium carbonate) or wood ash to raise the pH and neutralize acidity. Consider incorporating cow dung (CD) and tea waste (TW), as they positively influence pH levels in the vermicomposting process. Monitor and adjust the ratios of amendments, such as textile mill sludge (TMS) with CD and TW, to improve compost quality and pH management. Regularly test the pH to make timely adjustments and prevent it from dropping too low. Increase organic matter that is less acidic, like dried leaves or neutral/alkaline plant materials, to help raise the pH. Ensure proper aeration to promote aerobic decomposition, which stabilizes pH levels (Kumar, Badhwar, & Singh, 2021).    ",
  },
];

function EvaluateRules(data) {
  const recommendations = [];

  rules.forEach((rule) => {
    if (rule.condition(data)) {
      recommendations.push(rule.recommendation);
    }
  });

  return recommendations;
}
export default EvaluateRules;