// Real world leaders data for each country
export const countryLeaders: Record<string, { name: string; title: string; avatar: string }> = {
  // Americas
  "United States": { name: "Joe Biden", title: "President", avatar: "👨‍💼" },
  "Canada": { name: "Justin Trudeau", title: "Prime Minister", avatar: "👨‍💼" },
  "Mexico": { name: "Claudia Sheinbaum", title: "President", avatar: "👩‍💼" },
  "Brazil": { name: "Luiz Inácio Lula da Silva", title: "President", avatar: "👨‍💼" },
  "Argentina": { name: "Javier Milei", title: "President", avatar: "👨‍💼" },
  "Chile": { name: "Gabriel Boric", title: "President", avatar: "👨‍💼" },
  "Colombia": { name: "Gustavo Petro", title: "President", avatar: "👨‍💼" },
  "Peru": { name: "Dina Boluarte", title: "President", avatar: "👩‍💼" },
  "Venezuela": { name: "Nicolás Maduro", title: "President", avatar: "👨‍💼" },
  "Cuba": { name: "Miguel Díaz-Canel", title: "President", avatar: "👨‍💼" },
  
  // Europe
  "United Kingdom": { name: "Keir Starmer", title: "Prime Minister", avatar: "👨‍💼" },
  "France": { name: "Emmanuel Macron", title: "President", avatar: "👨‍💼" },
  "Germany": { name: "Olaf Scholz", title: "Chancellor", avatar: "👨‍💼" },
  "Italy": { name: "Giorgia Meloni", title: "Prime Minister", avatar: "👩‍💼" },
  "Spain": { name: "Pedro Sánchez", title: "Prime Minister", avatar: "👨‍💼" },
  "Russia": { name: "Vladimir Putin", title: "President", avatar: "👨‍💼" },
  "Ukraine": { name: "Volodymyr Zelenskyy", title: "President", avatar: "👨‍💼" },
  "Poland": { name: "Andrzej Duda", title: "President", avatar: "👨‍💼" },
  "Netherlands": { name: "Mark Rutte", title: "Prime Minister", avatar: "👨‍💼" },
  "Belgium": { name: "Alexander De Croo", title: "Prime Minister", avatar: "👨‍💼" },
  "Sweden": { name: "Ulf Kristersson", title: "Prime Minister", avatar: "👨‍💼" },
  "Norway": { name: "Jonas Gahr Støre", title: "Prime Minister", avatar: "👨‍💼" },
  "Denmark": { name: "Mette Frederiksen", title: "Prime Minister", avatar: "👩‍💼" },
  "Finland": { name: "Petteri Orpo", title: "Prime Minister", avatar: "👨‍💼" },
  "Switzerland": { name: "Viola Amherd", title: "President", avatar: "👩‍💼" },
  "Austria": { name: "Karl Nehammer", title: "Chancellor", avatar: "👨‍💼" },
  "Greece": { name: "Kyriakos Mitsotakis", title: "Prime Minister", avatar: "👨‍💼" },
  "Portugal": { name: "Luís Montenegro", title: "Prime Minister", avatar: "👨‍💼" },
  "Czech Republic": { name: "Petr Fiala", title: "Prime Minister", avatar: "👨‍💼" },
  "Romania": { name: "Marcel Ciolacu", title: "Prime Minister", avatar: "👨‍💼" },
  "Hungary": { name: "Viktor Orbán", title: "Prime Minister", avatar: "👨‍💼" },
  
  // Asia
  "China": { name: "Xi Jinping", title: "President", avatar: "👨‍💼" },
  "Japan": { name: "Fumio Kishida", title: "Prime Minister", avatar: "👨‍💼" },
  "South Korea": { name: "Yoon Suk-yeol", title: "President", avatar: "👨‍💼" },
  "India": { name: "Narendra Modi", title: "Prime Minister", avatar: "👨‍💼" },
  "Indonesia": { name: "Prabowo Subianto", title: "President", avatar: "👨‍💼" },
  "Thailand": { name: "Srettha Thavisin", title: "Prime Minister", avatar: "👨‍💼" },
  "Vietnam": { name: "Tô Lâm", title: "President", avatar: "👨‍💼" },
  "Philippines": { name: "Bongbong Marcos", title: "President", avatar: "👨‍💼" },
  "Malaysia": { name: "Anwar Ibrahim", title: "Prime Minister", avatar: "👨‍💼" },
  "Singapore": { name: "Lawrence Wong", title: "Prime Minister", avatar: "👨‍💼" },
  "Pakistan": { name: "Shehbaz Sharif", title: "Prime Minister", avatar: "👨‍💼" },
  "Bangladesh": { name: "Muhammad Yunus", title: "Chief Adviser", avatar: "👨‍💼" },
  "Turkey": { name: "Recep Tayyip Erdoğan", title: "President", avatar: "👨‍💼" },
  "Iran": { name: "Masoud Pezeshkian", title: "President", avatar: "👨‍💼" },
  "Saudi Arabia": { name: "Mohammed bin Salman", title: "Crown Prince", avatar: "🤴" },
  "Israel": { name: "Benjamin Netanyahu", title: "Prime Minister", avatar: "👨‍💼" },
  "UAE": { name: "Mohammed bin Zayed", title: "President", avatar: "🤴" },
  "Qatar": { name: "Tamim bin Hamad", title: "Emir", avatar: "🤴" },
  "Iraq": { name: "Mohammed Shia al-Sudani", title: "Prime Minister", avatar: "👨‍💼" },
  "Afghanistan": { name: "Hibatullah Akhundzada", title: "Supreme Leader", avatar: "👨‍💼" },
  "Kazakhstan": { name: "Kassym-Jomart Tokayev", title: "President", avatar: "👨‍💼" },
  "Uzbekistan": { name: "Shavkat Mirziyoyev", title: "President", avatar: "👨‍💼" },
  
  // Africa
  "Egypt": { name: "Abdel Fattah el-Sisi", title: "President", avatar: "👨‍💼" },
  "South Africa": { name: "Cyril Ramaphosa", title: "President", avatar: "👨‍💼" },
  "Nigeria": { name: "Bola Tinubu", title: "President", avatar: "👨‍💼" },
  "Kenya": { name: "William Ruto", title: "President", avatar: "👨‍💼" },
  "Ethiopia": { name: "Abiy Ahmed", title: "Prime Minister", avatar: "👨‍💼" },
  "Ghana": { name: "Nana Akufo-Addo", title: "President", avatar: "👨‍💼" },
  "Tanzania": { name: "Samia Suluhu Hassan", title: "President", avatar: "👩‍💼" },
  "Uganda": { name: "Yoweri Museveni", title: "President", avatar: "👨‍💼" },
  "Morocco": { name: "Mohammed VI", title: "King", avatar: "🤴" },
  "Algeria": { name: "Abdelmadjid Tebboune", title: "President", avatar: "👨‍💼" },
  "Tunisia": { name: "Kais Saied", title: "President", avatar: "👨‍💼" },
  "Libya": { name: "Abdul Hamid Dbeibeh", title: "Prime Minister", avatar: "👨‍💼" },
  "Sudan": { name: "Abdel Fattah al-Burhan", title: "Chairman", avatar: "👨‍💼" },
  "Senegal": { name: "Bassirou Diomaye Faye", title: "President", avatar: "👨‍💼" },
  "Ivory Coast": { name: "Alassane Ouattara", title: "President", avatar: "👨‍💼" },
  "Cameroon": { name: "Paul Biya", title: "President", avatar: "👨‍💼" },
  "Zimbabwe": { name: "Emmerson Mnangagwa", title: "President", avatar: "👨‍💼" },
  
  // Oceania
  "Australia": { name: "Anthony Albanese", title: "Prime Minister", avatar: "👨‍💼" },
  "New Zealand": { name: "Christopher Luxon", title: "Prime Minister", avatar: "👨‍💼" },
  "Papua New Guinea": { name: "James Marape", title: "Prime Minister", avatar: "👨‍💼" },
  "Fiji": { name: "Sitiveni Rabuka", title: "Prime Minister", avatar: "👨‍💼" },
  
  // Middle East
  "Jordan": { name: "Abdullah II", title: "King", avatar: "🤴" },
  "Lebanon": { name: "Najib Mikati", title: "Prime Minister", avatar: "👨‍💼" },
  "Syria": { name: "Bashar al-Assad", title: "President", avatar: "👨‍💼" },
  "Yemen": { name: "Rashad al-Alimi", title: "President", avatar: "👨‍💼" },
  "Oman": { name: "Haitham bin Tariq", title: "Sultan", avatar: "🤴" },
  "Kuwait": { name: "Mishal Al-Ahmad", title: "Emir", avatar: "🤴" },
  "Bahrain": { name: "Hamad bin Isa", title: "King", avatar: "🤴" },
  
  // Caribbean
  "Jamaica": { name: "Andrew Holness", title: "Prime Minister", avatar: "👨‍💼" },
  "Trinidad and Tobago": { name: "Keith Rowley", title: "Prime Minister", avatar: "👨‍💼" },
  "Barbados": { name: "Mia Mottley", title: "Prime Minister", avatar: "👩‍💼" },
  "Bahamas": { name: "Philip Davis", title: "Prime Minister", avatar: "👨‍💼" },
  
  // Central Asia
  "Mongolia": { name: "Luvsannamsrai Oyun-Erdene", title: "Prime Minister", avatar: "👨‍💼" },
  "Kyrgyzstan": { name: "Sadyr Japarov", title: "President", avatar: "👨‍💼" },
  "Tajikistan": { name: "Emomali Rahmon", title: "President", avatar: "👨‍💼" },
  "Turkmenistan": { name: "Serdar Berdimuhamedow", title: "President", avatar: "👨‍💼" },
  
  // Southeast Asia
  "Myanmar": { name: "Min Aung Hlaing", title: "Chairman", avatar: "👨‍💼" },
  "Cambodia": { name: "Hun Manet", title: "Prime Minister", avatar: "👨‍💼" },
  "Laos": { name: "Thongloun Sisoulith", title: "President", avatar: "👨‍💼" },
  "Brunei": { name: "Hassanal Bolkiah", title: "Sultan", avatar: "🤴" },
  "Timor-Leste": { name: "José Ramos-Horta", title: "President", avatar: "👨‍💼" },
  
  // South America
  "Uruguay": { name: "Luis Lacalle Pou", title: "President", avatar: "👨‍💼" },
  "Paraguay": { name: "Santiago Peña", title: "President", avatar: "👨‍💼" },
  "Bolivia": { name: "Luis Arce", title: "President", avatar: "👨‍💼" },
  "Ecuador": { name: "Daniel Noboa", title: "President", avatar: "👨‍💼" },
  "Guyana": { name: "Irfaan Ali", title: "President", avatar: "👨‍💼" },
  "Suriname": { name: "Chan Santokhi", title: "President", avatar: "👨‍💼" },
  
  // Central America
  "Guatemala": { name: "Bernardo Arévalo", title: "President", avatar: "👨‍💼" },
  "Honduras": { name: "Xiomara Castro", title: "President", avatar: "👩‍💼" },
  "Nicaragua": { name: "Daniel Ortega", title: "President", avatar: "👨‍💼" },
  "El Salvador": { name: "Nayib Bukele", title: "President", avatar: "👨‍💼" },
  "Costa Rica": { name: "Rodrigo Chaves", title: "President", avatar: "👨‍💼" },
  "Panama": { name: "José Raúl Mulino", title: "President", avatar: "👨‍💼" },
  "Belize": { name: "John Briceño", title: "Prime Minister", avatar: "👨‍💼" },
  
  // Eastern Europe
  "Belarus": { name: "Alexander Lukashenko", title: "President", avatar: "👨‍💼" },
  "Moldova": { name: "Maia Sandu", title: "President", avatar: "👩‍💼" },
  "Lithuania": { name: "Gitanas Nausėda", title: "President", avatar: "👨‍💼" },
  "Latvia": { name: "Edgars Rinkēvičs", title: "President", avatar: "👨‍💼" },
  "Estonia": { name: "Alar Karis", title: "President", avatar: "👨‍💼" },
  "Slovakia": { name: "Robert Fico", title: "Prime Minister", avatar: "👨‍💼" },
  "Slovenia": { name: "Robert Golob", title: "Prime Minister", avatar: "👨‍💼" },
  "Croatia": { name: "Andrej Plenković", title: "Prime Minister", avatar: "👨‍💼" },
  "Serbia": { name: "Aleksandar Vučić", title: "President", avatar: "👨‍💼" },
  "Bosnia and Herzegovina": { name: "Denis Bećirović", title: "Chairman", avatar: "👨‍💼" },
  "Albania": { name: "Edi Rama", title: "Prime Minister", avatar: "👨‍💼" },
  "North Macedonia": { name: "Hristijan Mickoski", title: "Prime Minister", avatar: "👨‍💼" },
  "Montenegro": { name: "Milojko Spajić", title: "Prime Minister", avatar: "👨‍💼" },
  "Kosovo": { name: "Albin Kurti", title: "Prime Minister", avatar: "👨‍💼" },
  "Bulgaria": { name: "Dimitar Glavchev", title: "Prime Minister", avatar: "👨‍💼" },
  
  // Default fallback
  "default": { name: "National Leader", title: "Head of State", avatar: "👨‍💼" }
};

export function getCountryLeader(countryName: string) {
  return countryLeaders[countryName] || countryLeaders["default"];
}
