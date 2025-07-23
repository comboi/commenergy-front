# CSV Bulk Import User Guide

## Overview

The CSV Bulk Import feature allows you to import multiple contracts into a community at once using a CSV (Comma-Separated Values) file. This guide will help you understand how to prepare your data and successfully import contracts.

## Getting Started

### Step 1: Download the Template

1. Click on the "Bulk Import" button in your community contracts table
2. In the modal that opens, click "Download Template" to get the CSV template file
3. Open the template file in a spreadsheet application (Excel, Google Sheets, etc.)

### Step 2: Fill the Template

Complete the template with your contract data following the specifications below.

## CSV File Format

### Required Columns ⚠️

These columns **must** be filled for all rows:

| Column         | Description                                        | Example                       |
| -------------- | -------------------------------------------------- | ----------------------------- |
| `contractCode` | Unique identifier for the contract (CUPS/CAU code) | `ES1234567890123456`          |
| `contractName` | Display name for the contract                      | `Contract Example`            |
| `contractType` | Type of contract                                   | `CONSUMPTION` or `GENERATION` |
| `userVat`      | User VAT/Tax identification number                 | `12345678A`                   |
| `provider`     | Energy provider company (see provider list below)  | `Iberdrola`                   |

### Optional Columns

These columns can be left empty but provide additional information:

| Column                   | Description                               | Example                                             |
| ------------------------ | ----------------------------------------- | --------------------------------------------------- |
| `contractPower`          | Contract power in kW                      | `100`                                               |
| `userName`               | Full name of the contract user            | `John Doe`                                          |
| `userEmail`              | Email address of the contract user        | `john@example.com`                                  |
| `userMobile`             | Mobile phone number                       | `+34600123456`                                      |
| `fullAddress`            | Complete address of the contract location | `123 Main St, Madrid`                               |
| `communityFee`           | Fee amount charged by the community       | `25.50`                                             |
| `communityFeePeriodType` | Frequency of community fee charges        | `Monthly`, `Quarterly`, `Semiannually`, or `Yearly` |

## Valid Energy Providers

**Important**: The `provider` field must exactly match one of the approved energy providers. You can use either the company name or the provider code.

### Major Energy Providers (Most Common)

| Provider Name                                    | Code   |
| ------------------------------------------------ | ------ |
| **i-DE REDES ELÉCTRICAS INTELIGENTES, S.A.U**    | R1-001 |
| **UFD DISTRIBUCIÓN ELECTRICIDAD, SA**            | R1-002 |
| **EDISTRIBUCIÓN REDES DIGITALES S.L.U.**         | R1-299 |
| **HIDROCANTÁBRICO DISTRIBUCIÓN ELÉCTRICA S.A.U** | R1-008 |
| **VIESGO DISTRIBUCIÓN ELECTRICA, S.L**           | R1-005 |

### Complete Energy Providers List

<details>
<summary>Click to expand the complete list of energy providers</summary>

| Provider Name                                                               | Code   |
| --------------------------------------------------------------------------- | ------ |
| AGRI-ENERGIA ELECTRICA, SA                                                  | R1-014 |
| AGRUPACIÓN DISTRIBUIDORA DE ESCUER, S.L.                                    | R1-310 |
| ADURIZ DISTRIBUCION SL                                                      | R1-090 |
| AFRODISIO PASCUAL ALONSO SL                                                 | R1-284 |
| ALARCON NAVARRO EMPRESA ELECTRICA, S.L.                                     | R1-301 |
| ALCONERA DE ELECTRICIDAD SL                                                 | R1-345 |
| ALGINET DISTRIBUCIÓN ENERGÍA ELÉCTRICA, S.L.U                               | R1-060 |
| ALSET ELÉCTRICA, S.L.                                                       | R1-191 |
| ANSELMO LEON-DISTRIBUCION SL                                                | R1-043 |
| ANTOLINA RUIZ RUIZ, S.L.                                                    | R1-184 |
| ARAGONESA DE ACTIVIDADES ENERGETICAS, S.A.                                  | R1-179 |
| ARAMAIOKO ARGINDAR BANATZAILEA SA                                           | R1-302 |
| AURORA GINER REIG S.L.                                                      | R1-111 |
| BARRAS ELÉCTRICAS GALAICO-ASTURIANAS, S. A                                  | R1-003 |
| BASSOLS ENERGÍA, S.A                                                        | R1-015 |
| BERRUEZA SA                                                                 | R1-083 |
| BLAZQUEZ SL                                                                 | R1-084 |
| C. MARCIAL CHACON E HIJOS, S.L.                                             | R1-180 |
| CARDENER DISTRIBUCIO ELECTRICA S.L.U.                                       | R1-037 |
| CATENERIBAS SLU                                                             | R1-336 |
| CENTRAL ELECTRICA DE POZO LORENTE SL                                        | R1-307 |
| CENTRAL ELECTRICA INDUSTRIAL, S.L                                           | R1-242 |
| CENTRAL ELECTRICA MITJANS,SL                                                | R1-085 |
| CENTRAL ELECTRICA SAN ANTONIO SL                                            | R1-210 |
| CENTRAL ELECTRICA SAN FRANCISCO, S.L.                                       | R1-086 |
| CENTRAL ELECTRICA SESTELO Y COMPAÑIA SA                                     | R1-022 |
| COELCA REDES, S.L.U.                                                        | R1-150 |
| COMPAÑIA DE ELECTRICIDAD DEL CONDADO S.A.                                   | R1-044 |
| COMPAÑIA DE ELECTRIFICACION S.L                                             | R1-068 |
| COMPAÑIA ELECTRICA DE FEREZ SL                                              | R1-253 |
| COMPAÑIA MELILLENSE DE GAS Y ELECTRICIDAD S.A                               | R1-027 |
| COOPERATIVA ELECTRICA ALBORENSE SA                                          | R1-024 |
| COOPERATIVA POPULAR DE FLUID ELECTRIC CAMPRODON SCCL                        | R1-153 |
| DECAIL ENERGÍA, S.L.U.                                                      | R1-245 |
| DELGICHI . SL                                                               | R1-162 |
| DIELENOR SL                                                                 | R1-106 |
| DIELEC GUERRERO LORENTE SL                                                  | R1-163 |
| DIELESUR, SL                                                                | R1-053 |
| DISELSOT SL                                                                 | R1-158 |
| DIST. ELECTRICA LAS MERCEDES S.L.                                           | R1-087 |
| DISTRIBUCIONES ALNEGA SL                                                    | R1-288 |
| DISTRIBUCIONES DE ENERGÍA ELÉCTRICAS DEL NOROESTE SL                        | R1-185 |
| DISTRIBUCIONES ELECTRICAS GISTAIN S.L.                                      | R1-361 |
| DISTRIBUCIONES ELECTRICAS PORTILLO SL                                       | R1-175 |
| DISTRIBUCIONES ELÉCTRICAS DE POZUELO, S.A.                                  | R1-286 |
| DISTRIBUCIONES ELÉCTRICAS DEL ERIA, SL                                      | R1-206 |
| DISTRIBUCIONES ELECTRICAS TALAYUELAS SL                                     | R1-329 |
| DISTRIBUCIÓN DE ELECTRICIDAD VALLE DE SANTA ANA, SL                         | R1-164 |
| DISTRIBUCIÓN ELÉCTRICA CREVILLENT S.L.U.                                    | R1-033 |
| DISTRIBUCIÓN ELÉCTRICA DE ALCOLECHA S.L.                                    | R1-271 |
| DISTRIBUCIÓN ELÉCTRICA DE CALLOSA DE SEGURA SLU                             | R1-145 |
| DISTRIBUCIÓN ELÉCTRICA DEL POZO DEL TIO RAIMUNDO, S.L.U.                    | R1-283 |
| DISTRIBUCIO ELECTRICA CATRALENSE, SLU                                       | R1-063 |
| DISTRIBUCION ELECTRICA DEL TAJUÑA SLU                                       | R1-317 |
| DISTRIBUIDORA DE ENERGIA ELECTRICA ENRIQUE GARCÍA SERRANO S.L. (EXTINGUIDA) | R1-031 |
| DISTRIBUIDORA DE ENERGIA ELECTRICA ENERQUINTA SL                            | R1-298 |
| DISTRIBUIDORA DE ENERGIA ELECTRICA TORRECILLAS VIDAL S.L.                   | R1-241 |
| DISTRIBUIDORA DE ENERGÍA ELÉCTRICA DE DON BENITO, S.L.U.                    | R1-047 |
| DISTRIBUIDORA DE ENERGÍA ELÉCTRICA DEL BAGES, S.A.                          | R1-107 |
| DISTRIBUIDORA DE ELECTRICIDAD MARTOS MARÍN S.L.                             | R1-139 |
| DISTRIBUIDORA DE ELECTRICIDAD LARRAÑAGA, S.L.                               | R1-093 |
| DISTRIBUIDORA ELÉCTRICA ALBATERENSE NUESTRA SEÑORA DE LA LUZ, S.L.U.        | R1-151 |
| DISTRIBUIDORA ELECTRICA BERMEJALES SL                                       | R1-036 |
| DISTRIBUIDORA ELECTRICA BRAVO SAEZ SL                                       | R1-200 |
| DISTRIBUIDORA ELECTRICA CARRION S.L.                                        | R1-140 |
| DISTRIBUIDORA ELECTRICA DE ARDALES SL                                       | R1-112 |
| DISTRIBUIDORA ELÉCTRICA DE CASAS DE LAZARO, S.A.                            | R1-287 |
| DISTRIBUIDORA ELECTRICA DE GAUCIN SL                                        | R1-122 |
| DISTRIBUIDORA ELECTRICA DE GRANJA DE TORREHERMOSA SL                        | R1-165 |
| DISTRIBUIDORA ELÉCTRICA DE MELIANA, S.L.                                    | R1-152 |
| DISTRIBUIDORA ELÉCTRICA DE MELÓN, S.L.                                      | R1-069 |
| DISTRIBUIDORA ELECTRICA DE RELLEU S.L.                                      | R1-089 |
| DISTRIBUIDORA ELÉCTRICA DEL PUERTO DE LA CRUZ, S.A                          | R1-294 |
| DISTRIBUIDORA ELÉCTRICA DEL SIL, S.L                                        | R1-029 |
| DISTRIBUIDORA ELECTRICA ISABA SL                                            | R1-207 |
| DISTRIBUIDORA ELECTRICA MONESTERIO SL                                       | R1-199 |
| DISTRIBUIDORA ELECTRICA MONTOLIU SL                                         | R1-224 |
| DISTRIBUIDORA ELÉCTRICA NAVASFRÍAS S.L. (EXTINGUIDA)                        | R1-216 |
| DISTRIBUIDORA ELECTRICA NIEBLA                                              | R1-277 |
| DISTRIBUIDORA ELECTRICA TENTUDIA SL                                         | R1-046 |
| DISTRIBUIDORA ELECTRICA VALLE DE ANSO SL                                    | R1-350 |
| DISTRIBUIDORA ELÈCTRICA D'ALBATÀRREC S.L                                    | R1-296 |
| DISTRIBUCION DE ENERGIA ELECTRICA DE PARCENT SL                             | R1-240 |
| EBROFANAS, S.L.                                                             | R1-197 |
| EDFA CASABLANCA DISTRIBUIDORA SLU                                           | R1-160 |
| EL PROGRESO DEL PIRINEO, S.L.                                               | R1-236 |
| ELEC VALL DE BOI                                                            | R1-274 |
| ELECTRA ALVARO DE BENITO SL                                                 | R1-123 |
| ELECTRA ALTO MIÑO DISTRIBUIDORA DE ENERGIA SL                               | R1-041 |
| ELECTRA AVELLANA, SL                                                        | R1-091 |
| ELECTRA CALDENSE S.A                                                        | R1-016 |
| ELECTRA CASTILLEJENSE SA                                                    | R1-092 |
| ELECTRA CONILENSE S.L.U.                                                    | R1-174 |
| ELECTRA CUNTIENSE, SL                                                       | R1-211 |
| ELECTRA DE BARCIADEMERA SL                                                  | R1-073 |
| ELECTRA DE CABALAR S.L.                                                     | R1-070 |
| ELECTRA DE CARBAYIN, S.A.U                                                  | R1-064 |
| ELECTRA DE SANTA COMBA SL                                                   | R1-204 |
| ELECTRA DE ZAS, SL                                                          | R1-186 |
| ELECTRA DEL GAYOSO, S.L                                                     | R1-071 |
| ELECTRA DEL LLOBREGAT ENERGÍA, S.L                                          | R1-363 |
| ELECTRA DEL NARAHIO SA                                                      | R1-072 |
| ELECTRA DO FOXO                                                             | R1-270 |
| ELECTRA LA HONORINA, S.L.                                                   | R1-260 |
| ELECTRA LA LOMA SL                                                          | R1-134 |
| ELECTRA LA ROSA S.L.                                                        | R1-135 |
| ELECTRA ORBAICETA, S.L.                                                     | R1-297 |
| ELECTRA REDENERGIA SL                                                       | R1-365 |
| ELECTRA SALTEA S.L.U.                                                       | R1-254 |
| ELECTRA SAN CRISTOBAL                                                       | R1-094 |
| ELECTRA TUDANCA S.L.                                                        | R1-326 |
| ELECTRA VALDIVIELSO SAU                                                     | R1-193 |
| ELECTRA VALDIZARBE DISTRIBUCIÓN, S.L.U.                                     | R1-232 |
| ELECTRICAS DE BENUZA, SL                                                    | R1-213 |
| ELECTRICAS DE VALLANCA, S.L.                                                | R1-358 |
| ELECTRICAS HIDROBESORA SL                                                   | R1-352 |
| ELECTRICAS PITARCH DISTRIBUCION SLU                                         | R1-049 |
| ELECTRICAS SANTA LEONOR SL                                                  | R1-255 |
| ELECTRICAS TUEJAR SL                                                        | R1-346 |
| ELECTRICA ABENGIBRENSE DISTRIBUCION S.L                                     | R1-195 |
| ELECTRICA ARANGARONA, SLU                                                   | R1-327 |
| ELECTRICA BAÑESA, SL                                                        | R1-225 |
| ELECTRICA CAMPOSUR SL                                                       | R1-124 |
| ELECTRICA COSTUR,SL                                                         | R1-340 |
| ELECTRICA CUROS, SL                                                         | R1-231 |
| ELECTRICA DE ALBERGUERIA SA                                                 | R1-290 |
| ELÉCTRICA DE ALGIMIA DE ALFARA DISTRIBUIDORA S.L.U.                         | R1-154 |
| ELECTRICA DE BIAR DISTRIBUCIÓN, S.L.U.                                      | R1-159 |
| ELECTRICA DE CABAÑAS                                                        | R1-074 |
| ELECTRICA DE CANILES                                                        | R1-088 |
| ELECTRICA DE CANTOÑA S.L.                                                   | R1-220 |
| ELECTRICA DE CASTRO CALDELAS                                                | R1-234 |
| ELÉCTRICA DE CATOIRA, S.L.                                                  | R1-282 |
| ELECTRICA DE CHERA DISTRIBUIDORA SL                                         | R1-128 |
| ELECTRICA DE DURRO S.L.                                                     | R1-156 |
| ELECTRICA DE ERISTE SL                                                      | R1-125 |
| ELECTRICA DE GRES, SL                                                       | R1-075 |
| ELECTRICA DE GUADASSUAR DISTRIBUCION SLU                                    | R1-157 |
| ELÉCTRICA DE GUIXÉS, SL                                                     | R1-065 |
| ELECTRICA DE JAFRE                                                          | R1-176 |
| ELECTRICA DE LÍJAR SL                                                       | R1-342 |
| ELECTRICA DE MALCOCINADO SL                                                 | R1-357 |
| ELECTRICA DE MOSCOSO S.L                                                    | R1-076 |
| ELECTRICA DE VALDRIZ, S L                                                   | R1-275 |
| ELECTRICA DE VER, S.L                                                       | R1-267 |
| ELECTRICA DEL EBRO SA                                                       | R1-019 |
| ELECTRICA DEL HUEBRA SL                                                     | R1-215 |
| ELECTRICA DEL MONTSEC SL                                                    | R1-279 |
| ELECTRICA DEL OESTE DISTRIBUCION, S.L.U.                                    | R1-035 |
| ELECTRICA GILENA SLU                                                        | R1-221 |
| ELECTRICA GUADALFEO SL                                                      | R1-262 |
| ELÉCTRICA HERMANOS CASTRO RODRIGUEZ S.L.                                    | R1-114 |
| ELECTRICA LATORRE S.L.                                                      | R1-233 |
| ELECTRICA LOS LAURELES S.L.                                                 | R1-177 |
| ELECTRICA LOS MOLINOS SLU                                                   | R1-079 |
| ELECTRICIDAD DE PUERTO REAL, S.A. (EPRESA)                                  | R1-034 |
| ELECTRICIDAD HIJATE S.L.                                                    | R1-126 |
| ELECTRICIDAD LA ASUNCION SL                                                 | R1-188 |
| ELECTRICIDAD PASTOR SL                                                      | R1-148 |
| ELECTRICITAT LA AURORA, SLU                                                 | R1-099 |
| ELECTRICA MESTANZA RV SL                                                    | R1-217 |
| ELECTRICA MORO BENITO SL                                                    | R1-181 |
| ELECTRICA MUNICIPAL DE SANTA COLOMA DE QUERALT, SL                          | R1-360 |
| ELECTRICA NRA SRA DE LOS SANTOS SL                                          | R1-201 |
| ELECTRICA SAGRADO CORAZON DE JESUS S.L                                      | R1-198 |
| ELECTRICA SAAVEDRA S.A                                                      | R1-248 |
| ELECTRICA SAN GREGORIO SL                                                   | R1-136 |
| ELECTRICA SAN JOSE OBRERO, S.L                                              | R1-178 |
| ELECTRICA SAN MARCOS SL                                                     | R1-229 |
| ELECTRICA SAN SERVAN SL                                                     | R1-132 |
| ELECTRICA SANTA CLARA SL                                                    | R1-166 |
| ELECTRICA SANTA MARTA Y VILLALBA SL                                         | R1-264 |
| ELECTRICA SEROSENSE DISTRIBUIDORA SL                                        | R1-038 |
| ELECTRICA SERRANIA DE RONDA S.L                                             | R1-196 |
| ELECTRICA SUDANELL SL                                                       | R1-351 |
| ELECTRICA VAQUER SA                                                         | R1-066 |
| ELÉCTRICA BELMEZANA S.A.                                                    | R1-095 |
| ELÉCTRICA CONQUENSE DISTRIBUCIÓN S.A.                                       | R1-009 |
| ELÉCTRICA CORVERA S.L.                                                      | R1-077 |
| ELÉCTRICAS COLLADO BLANCO, S L                                              | R1-353 |
| ELÉCTRICAS DE VILLAHERMOSA,S.A.                                             | R1-300 |
| ELÉCTRICA LATORRE S.L.                                                      | R1-233 |
| ELÉCTRICAS LA ENGUERINA, S L                                                | R1-355 |
| ELECTRICA SERRALLO, S.L.U                                                   | R1-356 |
| ELECTRADISTRIBUCIÓ CENTELLES S.L.                                           | R1-268 |
| ELECTRO DISTRIBUIDORA CASTELLANO-LEONESA S.A. (EXTINGUIDA)                  | R1-192 |
| ELECTRO ESCARRILLA, S.L                                                     | R1-289 |
| ELECTRO MANZANEDA SL                                                        | R1-359 |
| ELECTRO MOLINERA DE VALMADRIGAL SL                                          | R1-101 |
| ELECTRO SALLENT DE GÁLLEGO, S.L.                                            | R1-281 |
| ELECTRO-HARINERA BELSETANA DISTRIBUCIÓN, SLU                                | R1-348 |
| ELEKTRA URDAZUBI SL                                                         | R1-339 |
| ELÈCTRICA SALÀS DE PALLARS, SLU                                             | R1-347 |
| EMDECORIA . SL                                                              | R1-256 |
| EMILIO PADILLA E HIJOS SL                                                   | R1-238 |
| EMPRESA DE ALUMBRADO ELÉCTRICO DE CEUTA DISTRIBUCIÓN, SAU                   | R1-030 |
| EMPRESA ELÉCTRICA DE SAN PEDRO S.L                                          | R1-194 |
| EMPRESA ELÉCTRICA DEL CABRIEL S.L.(EXTINGUIDA).                             | R1-330 |
| EMPRESA ELECTRICA MARTIN SILVA POZO SL                                      | R1-167 |
| EMPRESA ELECTRICIDAD SAN JOSE SA                                            | R1-102 |
| EMPRESA MUNICIPAL DE DISTRIBUCIÓ D'ENERGIA ELÈCTRICA D'ALMENAR, SLU         | R1-325 |
| EMPRESA MUNICIPAL DE DISTRIBUCIÓ D'ENERGIA ELÈCTRICA DE PONTS, SL           | R1-314 |
| EMPRESA MUNICIPAL ENERGIA ELECTRICA TORRES DE SEGRE SL                      | R1-273 |
| ENERFRIAS SLU                                                               | R1-208 |
| ENERGIA DE MIAJADAS SA                                                      | R1-054 |
| ENERGIA ELECTRICA DE OLVERA S.L.U                                           | R1-098 |
| ENERGETICA DE ALCOCER SL                                                    | R1-108 |
| ENERGIAS DE ARAGÓN I S.L.                                                   | R1-026 |
| ENERGIAS DE BENASQUE S.L                                                    | R1-285 |
| ENERGIAS DE LA VILLA DE CAMPO, S.L.                                         | R1-343 |
| ENERGIAS DE PANTICOSA S.L.                                                  | R1-222 |
| ENERGÍAS DEL ZINQUETA S.L.                                                  | R1-362 |
| ESTABANELL Y PAHISA ENERGÍA, S.A.                                           | R1-018 |
| FELIPE BLAZQUEZ SL                                                          | R1-246 |
| FLUIDO ELÉCTRICO MUSEROS DISTRIBUCIÓN ELÉCTRICA, S.L.U.                     | R1-161 |
| FUCIÑOS RIVAS, S L                                                          | R1-078 |
| FUENTES Y COMPAÑÍA S.L.                                                     | R1-182 |
| FUERZAS ELÉCTRICAS DE BOGARRA S.A. -FEBOSA-                                 | R1-323 |
| GESTIÓN DEL SERVICIO ELÉCTRICO HECHO S.L.                                   | R1-344 |
| GLORIA MARISCAL S.L.                                                        | R1-226 |
| GRACIA UNZUETA HIDALGO E HIJOS SL                                           | R1-110 |
| GRUPO DE ELECTRIFICACIÓN RURAL DE BINÉFAR Y COMARCA SOC. COOP               | R1-059 |
| HELIODORA GOMEZ SA                                                          | R1-141 |
| HELIODORO CHAFER SL                                                         | R1-306 |
| HEREDEROS DE CARLOS OLTRA SL                                                | R1-252 |
| HEREDEROS DE EMILIO GAMERO SL                                               | R1-223 |
| HEREDEROS DE GARCIA BAZ SL                                                  | R1-137 |
| HEREDEROS DE MARÍA ALONSO CALZADA VENTA DE BAÑOS S.L. (EXTINGUIDA)          | R1-265 |
| HERMANOS CABALLERO REBOLLO SL                                               | R1-067 |
| HIDROCANTÁBRICO DISTRIBUCIÓN ELÉCTRICA S.A.U                                | R1-008 |
| HIDROFLAMICELL, S.L.                                                        | R1-304 |
| HIDROELÉCTRICA DE ALARAZ S.L.                                               | R1-130 |
| HIDROELÉCTRICA DE CATALUNYA, S.L.                                           | R1-218 |
| HIDROELECTRICA DE LARACHA S.L.U.                                            | R1-039 |
| HIDROELECTRICA DE SILLEDA SL                                                | R1-058 |
| HIDROELÉCTRICA DEL GUADIELA I, SA                                           | R1-023 |
| HIDROELECTRICA DEL ARNEGO, S.L                                              | R1-080 |
| HIDROELECTRICA DEL CABRERA,S L                                              | R1-187 |
| HIDROELECTRICA DOMINGUEZ SL                                                 | R1-173 |
| HIDROELECTRICA EL CARMEN REDES SL                                           | R1-133 |
| HIDROELÉCTRICA EL CERRAJÓN S.L.                                             | R1-243 |
| HIDROELECTRICA GOMEZ SLU                                                    | R1-129 |
| HIDROELÉCTRICA JOSÉ MATANZA GARCÍA, S.L.                                    | R1-244 |
| HIDROELECTRICA SAN BUENAVENTURA SL                                          | R1-168 |
| HIDROELECTRICA SANTA TERESA SL                                              | R1-169 |
| HIDROELECTRICA VEGA SA                                                      | R1-115 |
| HIDROELECTRICA VIRGEN DE CHILLA SL                                          | R1-104 |
| HIDROENERGETICA DE MILLARES,SL                                              | R1-258 |
| HIJOS DE CASIANO SANCHEZ SL                                                 | R1-170 |
| HIJOS DE FELIPE GARCIA ALVAREZ SL                                           | R1-149 |
| HIJOS DE FRANCISCO ESCASO SL                                                | R1-257 |
| HIJOS DE JACINTO GUILLEN DISTRIBUIDORA ELECTRICA SL                         | R1-050 |
| HIJOS DE MANUEL PERLES VICENS SL                                            | R1-266 |
| HIJO DE JORGE MARTIN SA                                                     | R1-116 |
| ICASA DISTRIBUCION ENERGIA SL                                               | R1-205 |
| i-DE REDES ELÉCTRICAS INTELIGENTES, S.A.U                                   | R1-001 |
| IGNALUZ JIMÉNEZ DE TORRES, S.L                                              | R1-276 |
| INDUSTRIAL BARCALESA, SL                                                    | R1-295 |
| INPECUARIAS POZOBLANCO, S.L.                                                | R1-025 |
| INPECUARIAS TORRECAMPO, S.L.                                                | R1-247 |
| INPECUARIAS VILLARALTO S.L                                                  | R1-109 |
| ISMAEL BIOSCA, S.L.                                                         | R1-131 |
| JOSE FERRE SEGURA E HIJOS SL                                                | R1-146 |
| JOSE RIPOLL ALBANELL S.L.                                                   | R1-117 |
| JOSEFA GIL COSTA SL                                                         | R1-118 |
| JUAN DE FRUTOS GARCIA DISTRIBUCIÓN ELÉCTRICA, S.L.U                         | R1-051 |
| JUAN N. DIAZ GALVEZ Y HERMANOS S.L.                                         | R1-127 |
| JUAN Y FRANCISCO ESTEVE MAS SL                                              | R1-249 |
| LA CONSTANCIA AREN SL                                                       | R1-349 |
| LA ELECTRICA DE VALL DE EBO SL                                              | R1-183 |
| LA ERNESTINA ENERGIA S.L.                                                   | R1-105 |
| LA PROHIDA DISTRIBUCIÓN ELÉCTRICA, S.L                                      | R1-048 |
| LA SINERQUENSE SLU                                                          | R1-319 |
| LEANDRO PÉREZ ALFONSO S.L.                                                  | R1-119 |
| LEINTZARGI . SL                                                             | R1-313 |
| LERSA ELECTRICITAT, S.L                                                     | R1-052 |
| LLUM D'AIN SL                                                               | R1-354 |
| LUIS RANGEL HERMANOS SA                                                     | R1-142 |
| LUZ DE CELA, S.L.                                                           | R1-228 |
| LUZ ELECTRICA DE ALGAR SL                                                   | R1-272 |
| LUZ ELECTRICA LOS MOLARES, SL                                               | R1-250 |
| MAESTRAZGO DISTRIBUCION ELECTRICA SL                                        | R1-017 |
| MANUEL ROBRES CELADES SL                                                    | R1-269 |
| MEDINA GARVEY ELECTRICIDAD, S.L.U.                                          | R1-028 |
| MOLINO VIEJO DE VILALLER, S.A.                                              | R1-202 |
| MONTESLUZ DISTRIBUCIÓN ELÉCTRICA S.L.                                       | R1-237 |
| MUNICIPAL ELECTRICA VILORIA SL                                              | R1-259 |
| OÑARGI SL                                                                   | R1-061 |
| PEDRO SANCHEZ IBAÑEZ S.L.                                                   | R1-309 |
| PEUSA DISTRIBUCIO SLU                                                       | R1-020 |
| RELKIA DISTRIBUIDORA DE ELECTRICIDAD S.L.                                   | R1-032 |
| RODALEC SL                                                                  | R1-214 |
| ROMERO CANDAU SL                                                            | R1-057 |
| RUIZ DE LA TORRE SL                                                         | R1-227 |
| SALTOS DEL CABRERA,S L                                                      | R1-239 |
| SAMPOL DISTRIBUCIÓN ELÉCTRICA, S.L                                          | R1-364 |
| SAN CIPRIANO DE RUEDA DISTRIBUCIÓN S.L. (EXTINGUIDA)                        | R1-103 |
| SAN MIGUEL 2000, DISTRIBUCIÓN ELÉCTRICA, S.L.U                              | R1-081 |
| SERVILIANO GARCÍA S.A                                                       | R1-143 |
| SERVICIOS URBANOS DE CERLER S.A.                                            | R1-251 |
| SERVICIOS Y SUMINISTROS MUNICIPALES ARAS SL                                 | R1-320 |
| SERVICIOS Y SUMINISTROS MUNICIPALES DE CHULILLA S.L.                        | R1-335 |
| SIERRO DE ELECTRICIDAD, S. L.                                               | R1-138 |
| SOCIEDAD DISTRIBUIDORA ELÉCTRICA DE ELORRIO S.A. (EXTINGUIDA)               | R1-120 |
| SOCIEDAD ELECTRICA DE RIBERA DEL FRESNO SL                                  | R1-190 |
| SOCIEDAD ELECTRICA JEREZ DEL MARQUESADO                                     | R1-171 |
| SOCIEDAD ELECTRICA NUESTRA SEÑORA DE LOS DESAMPARADOS SL                    | R1-121 |
| SOCIETAT MUNICIPAL DE DISTRIBUCIÓ ELECTRICA DE TIRVIA, S.L.                 | R1-337 |
| SOCIEDAD ELECTRICISTA DE TUI DISTRIBUIDORA SLU                              | R1-040 |
| SOCIETAT MUNICIPAL DISTRIBUIDORA ELÈCTRICA DE LLAVORSÍ S.L.                 | R1-305 |
| SUCESORES DE MANUEL LEIRA, SL                                               | R1-082 |
| SUMINISTRADORA ELECTRICA DE CADIZ, S.A                                      | R1-021 |
| SUMINISTRO DE LUZ Y FUERZA, S.L                                             | R1-062 |
| SUMINISTROS ELECTRICOS AMIEVA SL                                            | R1-172 |
| SUMINISTROS ELECTRICOS ISABENA SL                                           | R1-338 |
| TALARN DISTRIBUCIÓ MUNICIPAL ELÉCTRICA,SL                                   | R1-341 |
| TOLARGI SL                                                                  | R1-278 |
| UFD DISTRIBUCIÓN ELECTRICIDAD, SA                                           | R1-002 |
| UNIÓN DE DISTRIBUIDORES DE ELECTRICIDAD S.A. -UDESA-                        | R1-042 |
| VALL DE SOLLER ENERGIA SLU                                                  | R1-056 |
| VARGAS Y COMPAÑIA ELECTRO HARINERA SAN RAMON S.A.                           | R1-203 |
| VIESGO DISTRIBUCIÓN ELECTRICA, S.L                                          | R1-005 |
| VINALESA DISTRIBUCION DE ENERGIA SL                                         | R1-155 |

</details>

## Data Validation Rules

### Contract Code

- Must be unique across all contracts in the community
- Should follow the standard format for CUPS/CAU codes
- Example: `ES1234567890123456`

### Contract Type

- Only two values are accepted:
  - `CONSUMPTION` - For energy consumption contracts
  - `GENERATION` - For energy generation contracts

### User VAT

- Must be a valid VAT/Tax identification number
- Format varies by country (e.g., Spanish format: `12345678A`)

### Email Format

- Must be a valid email address format
- Example: `user@example.com`

### Phone Format

- Include country code for international numbers
- Example: `+34600123456`

### Community Fee Period Type

- Only four values are accepted:
  - `Monthly`
  - `Quarterly`
  - `Semiannually`
  - `Yearly`

## Import Process

### Step 3: Upload Your File

1. Save your completed spreadsheet as a CSV file (File → Save As → CSV format)
2. In the bulk import modal, drag and drop your CSV file or click "Select File"
3. Review the file details and click "Import Contracts"

### Step 4: Review Results

After processing, you'll see a summary showing:

- Total contracts processed
- Successfully created contracts
- Failed contracts with error details
- Users created or found
- Community relationships established

## Common Issues and Solutions

### ❌ "Energy provider not found"

**Problem**: The provider name doesn't match exactly with our database.
**Solution**: Use the exact provider name or code from the list above. Check for typos or extra spaces.

### ❌ "Invalid contract type"

**Problem**: Contract type is not `CONSUMPTION` or `GENERATION`.
**Solution**: Use only the exact values: `CONSUMPTION` or `GENERATION`.

### ❌ "Duplicate contract code"

**Problem**: The same contract code appears multiple times in your file.
**Solution**: Ensure each contract code is unique within your CSV file.

### ❌ "Invalid email format"

**Problem**: Email address is not in a valid format.
**Solution**: Check that all email addresses follow the format: `name@domain.com`.

### ❌ "Required field missing"

**Problem**: A required column is empty.
**Solution**: Fill in all required fields: `contractCode`, `contractName`, `contractType`, `userVat`, and `provider`.

## Tips for Success

1. **Start Small**: Test with a few contracts first before importing large batches
2. **Double-Check Provider Names**: Provider validation is strict - use exact matches
3. **Validate Data**: Review your data for completeness before importing
4. **Keep Backups**: Save your original data files
5. **Review Results**: Always check the import summary for any issues

## Support

If you encounter issues not covered in this guide, please contact your system administrator with:

- Your CSV file
- Screenshot of any error messages
- Description of the problem

---

_This guide covers the CSV bulk import feature for contract management. For other features or technical support, please refer to your system documentation or contact support._
