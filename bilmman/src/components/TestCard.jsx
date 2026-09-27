import React, { useCallback, useRef, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/ohirgi.css";
import nuqta from "../images/nomi.png"
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

// Rasmlarni import qilish
import miran1 from "../images/test1.png";
import miran2 from "../images/test2.png";
import miran3 from "../images/test3.png";
import miran4 from "../images/test4.png";
import miran5 from "../images/test5.png";
import miran6 from "../images/test6.png";
import miran7 from "../images/test7.png";
import miran8 from "../images/test8.png";
import miran9 from "../images/test9.png";
import miran10 from "../images/test10.png";
import miran11 from "../images/test11.png";
import miran12 from "../images/test12.png";
import miran13 from "../images/test13.png";
import miran14 from "../images/test14.png";
import miran15 from "../images/test15.png";

// burchaklar

import bu1 from "../images/burchak1.png";
import bu2 from "../images/burchak2.png";
import bu3 from "../images/burchak3.png";
import bu4 from "../images/burchak4.png";
import bu5 from "../images/burchak5.png";
import bu6 from "../images/burchak6.png";
import bu7 from "../images/burchak7.png";
import bu8 from "../images/burchak8.png";
import bu9 from "../images/burchak9.png";
import bu10 from "../images/burchak10.png";
import bu11 from "../images/burchak11.png";
import bu12 from "../images/burchak12.png";
import bu13 from "../images/burchak13.png";
import bu14 from "../images/burchak14.png";
import bu115 from "../images/burchak15.png";

// uchburchak

import uch1 from "../images/uchburchak1.png";
import uch2 from "../images/uchburchak2.png";
import uch3 from "../images/uchburchak3.png";
import uch4 from "../images/uchburchak4.png";
import uch5 from "../images/uchburchak5.png";
import uch6 from "../images/uchburchak6.png";
import uch7 from "../images/uchburchak7.png";
import uch8 from "../images/uchburchak8.png";
import uch9 from "../images/uchburchak9.png";
import uch10 from "../images/uchburchak10.png";
import uch11 from "../images/uchburchak11.png";
import uch12 from "../images/uchburchak12.png";
import uch13 from "../images/uchburchak13.png";
import uch14 from "../images/uchburchak14.png";
import uch15 from "../images/uchburchak15.png";


// Parallelogramma
import Parallelogramma1 from "../images/para1.png";
import Parallelogramma2 from "../images/para2.png";
import Parallelogramma3 from "../images/para3.png";
import Parallelogramma4 from "../images/para4.png";
import Parallelogramma5 from "../images/para5.png";
import Parallelogramma6 from "../images/para6.png";
import Parallelogramma7 from "../images/para7.png";
import Parallelogramma8 from "../images/para8.png";
import Parallelogramma9 from "../images/para9.png";
import Parallelogramma10 from "../images/para10.png";
import Parallelogramma11 from "../images/para11.png";
import Parallelogramma12 from "../images/para12.png";
import Parallelogramma13 from "../images/para13.png";
import Parallelogramma14 from "../images/para14.png";
import Parallelogramma15 from "../images/para15.png";


//  aylana

import aylaan1 from "../images/aylana1.png";
import aylaan2 from "../images/aylana2.png";
import aylaan3 from "../images/aylana3.png";
import aylaan4 from "../images/aylana4.png";
import aylaan5 from "../images/aylana5.png";
import aylaan6 from "../images/aylana6.png";
import aylaan7 from "../images/aylana7.png";
import aylaan8 from "../images/aylana8.png";
import aylaan9 from "../images/aylana9.png";
import aylaan10 from "../images/aylana10.png";
import aylaan11 from "../images/aylana11.png";
import aylaan12 from "../images/aylana12.png";
import aylaan13 from "../images/aylana13.png";
import aylaan14 from "../images/aylana14.png";
import aylaan15 from "../images/aylana15.png";


// kardinata

import kordinata1 from "../images/ko1.png";
import kordinata2 from "../images/ko2.png";
import kordinata3 from "../images/ko3.png";
import kordinata4 from "../images/ko4.png";
import kordinata5 from "../images/ko5.png";
import kordinata6 from "../images/ko6.png";
import kordinata7 from "../images/ko7.png";
import kordinata8 from "../images/ko8.png";
import kordinata9 from "../images/ko9.png";
import kordinata10 from "../images/ko10.png";

import { recordVerifiedLocalAttemptV13 } from "../api/client";
const questionSets = [
  {
    category: "math",
    topic: "Natural sonlar va amallar",
    questions: [
      {
        question: "(24 + 18) ÷ 6 = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "15 × 4 − 18 = ?",
        options: ["38", "40", "42", "44"],
        answer: "42",
      },
      {
        question: "84 ÷ 7 + 16 = ?",
        options: ["26", "27", "28", "29"],
        answer: "28",
      },
      {
        question: "9 × (12 − 5) = ?",
        options: ["54", "63", "72", "81"],
        answer: "63",
      },
      {
        question: "48 + 36 ÷ 6 = ?",
        options: ["52", "54", "56", "58"],
        answer: "54",
      },
      {
        question: "(25 × 8) − 75 = ?",
        options: ["115", "120", "125", "130"],
        answer: "125",
      },
      {
        question: "144 ÷ 12 + 19 = ?",
        options: ["29", "30", "31", "32"],
        answer: "31",
      },
      {
        question: "17 × 5 − 28 = ?",
        options: ["55", "57", "59", "61"],
        answer: "57",
      },
      {
        question: "96 ÷ (8 × 2) = ?",
        options: ["4", "5", "6", "7"],
        answer: "6",
      },
      {
        question: "125 + 75 − 48 = ?",
        options: ["150", "152", "154", "156"],
        answer: "152",
      },
      {
        question: "18² ÷ 6 = ?",
        options: ["48", "52", "54", "56"],
        answer: "54",
      },
      {
        question: "13 × 13 − 25 = ?",
        options: ["142", "144", "146", "148"],
        answer: "144",
      },
      {
        question: "(240 ÷ 15) × 7 = ?",
        options: ["98", "105", "112", "119"],
        answer: "112",
      },
      {
        question: "320 − (48 × 5) = ?",
        options: ["70", "75", "80", "85"],
        answer: "80",
      },
      {
        question: "(99 + 51) ÷ 5 = ?",
        options: ["28", "29", "30", "31"],
        answer: "30",
      },
    ],
  },

  {
    category: "math",
    topic: "Matnli Masalalar",
    questions: [
      {
        question: "Ikkita sonning yig'indisi 56 ga, 1-sonning 3 baravari bilan 2-sonning 2 baravarining yig'indisi 136 ga teng. Bu sonlarni toping.",
        options: [
          "24 va 32",
          "28 va 28",
          "30 va 26",
          "34 va 22"
        ],
        answer: "24 va 32"
      },
      {
        question: "Ikki ishchi birgalikda ishni 12 kunda bitiradi. Agar birinchi ishchi 3 kunga kam, ikkinchi ishchi 6 kunga ko'p ishlasa, ish 10 kunda bitadi. Har bir ishchining alohida-alohida ishni tugatish vaqti necha kunga teng?",
        options: [
          "18 va 24",
          "20 va 30",
          "24 va 36",
          "15 va 20"
        ],
        answer: "24 va 36"
      },
      {
        question: "Bir savatda olma va noklar bor. Agar savatchadan 6 ta olma olib, o'rniga 8 ta nok qo'yilsa, undagi olma va noklar soni tenglashadi. Agar 4 ta nok olib, o'rniga 6 ta olma qo'yilsa, undagi olma soni noklar sonidan 10 taga ko'p bo'ladi. Boshlang'ich savatda nechta olma va nechta nok bor edi?",
        options: [
          "14 ta olma, 20 ta nok",
          "16 ta olma, 22 ta nok",
          "18 ta olma, 24 ta nok",
          "20 ta olma, 26 ta nok"
        ],
        answer: "16 ta olma, 22 ta nok"
      },
      {
        question: "Poyezd 360 km masofani belgilangan vaqtdan 1 soat erkini yetib bordi. Agar tezligi soatiga 10 km ga kam bo'lganida, 2 soat kechikib yetib borardi. Poyezdning tezligi (km/soat) ni toping.",
        options: [
          "60",
          "70",
          "80",
          "90"
        ],
        answer: "80"
      },
      {
        question: "Suv havzasining ikkita krani bor. Birinchi kran ochiq bo'lsa, havza 6 soatda to'ladi, ikkinchi kran ochiq bo'lsa, 9 soatda to'ladi. Ikkala kran bir vaqtda ochiq bo'lsa, havza nechada to'ladi?",
        options: [
          "3,2 soat",
          "3,6 soat",
          "3,75 soat",
          "4 soat"
        ],
        answer: "3,6 soat"
      },
      {
        question: "Uchburchakning bir tomoni 7 cm ga oshirilsa, perimetri 16 cm ga ortadi. Agar shu tomoni 5 cm ga kamaytirilsa, perimetri 4 cm ga kamayadi. Uchburchak perimetrini toping.",
        options: [
          "36 cm",
          "40 cm",
          "48 cm",
          "52 cm"
        ],
        answer: "48 cm"
      },
      {
        question: "Bir sonning 40% i 24 ga teng. Agar shu sonning 25% iga 15 qo'shilsa, qancha hosil bo'ladi?",
        options: [
          "30",
          "35",
          "40",
          "45"
        ],
        answer: "30"
      },
      {
        question: "Bir savdogar tovarni 20% foyda bilan sotdi. Agar u tovarning narxini yana 10% ga oshirsa, dastlabki narxga nisbatan umumiy foyda foizi necha bo'ladi?",
        options: [
          "28%",
          "30%",
          "32%",
          "33%"
        ],
        answer: "32%"
      },
      {
        question: "Ikki qishloq orasidagi masofa 48 km. Bir velosipedchi va bir piyoda qarama-qarshi yo'nalishda harakat qilishdi va ular 2 soatda uchrashdi. Velosipedchining tezligi piyoda tezligidan 12 km/soat ga katta. Ularning tezliklarini toping.",
        options: [
          "18 km/soat va 6 km/soat",
          "20 km/soat va 8 km/soat",
          "24 km/soat va 12 km/soat",
          "16 km/soat va 4 km/soat"
        ],
        answer: "18 km/soat va 6 km/soat"
      },
      {
        question: "Agar bir sonning kvadratidan 25 ayirilsa, 2 baravar 7 ortadi. Agar shu songa 5 qo'shilsa, uning kvadrati 4 baravar 21 kamayadi. Shu sonni toping.",
        options: [
          "3",
          "4",
          "5",
          "6"
        ],
        answer: "5"
      },
      {
        question: "Bir sinfda o'g'il bolalar soni qizlar sonidan 8 taga ko'p. Agar sinfga 2 ta qiz kelib qo'shilsa, o'g'il bolalar soni qizlar sonidan 2 marta ko'p bo'ladi. Sinfda nechta o'g'il va nechta qiz bor?",
        options: [
          "18 ta o'g'il, 10 ta qiz",
          "20 ta o'g'il, 12 ta qiz",
          "16 ta o'g'il, 8 ta qiz",
          "22 ta o'g'il, 14 ta qiz"
        ],
        answer: "20 ta o'g'il, 12 ta qiz"
      },
      {
        question: "A va B punktlardan bir-biriga tomon turli vaqtlarda ikki avtomobil yo'lga chiqdi va ular 180 km masofada uchrashgan. Agar ikkinchi avtomobil 1 soat kech chiqqanida, ular 150 km masofada uchrashgan bo'lardi. Avtomobillarning tezliklari yig'indisi necha km/soat?",
        options: [
          "90",
          "100",
          "110",
          "120"
        ],
        answer: "90"
      },
      {
        question: "Bir ishni bajarish uchun zarur vaqt mehnatkashlar soniga teskari proporsional bo'lib, agar 6 ta ishchi 12 kunda bajarsa, shu ishni 8 ta ishchi necha kunda bajaradi?",
        options: [
          "6 kunda",
          "7 kunda",
          "8 kunda",
          "9 kunda"
        ],
        answer: "9 kunda"
      },
      {
        question: "Agar uch xonali sonning yuzlar xonasidagi raqami ikkilar xonasiga, birliklar xonasidagi raqami o'nlar xonasiga ko'chirilib, o'nlar xonasidagi raqam o'z joyida qolsa, hosil bo'lgan yangi son dastlabki sondan 198 marta katta bo'ladi. Dastlabki sonni toping.",
        options: [
          "132",
          "213",
          "231",
          "312"
        ],
        answer: "132"
      },
      {
        question: "To'g'ri to'rtburchakning bo'yi enidan 8 cm katta, diagonali 10 cm ga teng bo'lsa, to'g'ri to'rtburchak yuzini toping.",
        options: [
          "24 cm²",
          "32 cm²",
          "40 cm²",
          "48 cm²"
        ],
        answer: "24 cm²"
      }
    ]
  },
  {
    category: "math",
    topic: "Ko'phadlar",
    questions: [
      {
        question: "Ko'phad P(x) = 2x³ − 5x² + 3x − 7 ko'phadning darajasi va yetakchi hadini aniqlang.",
        options: [
          "3; 2x³",
          "2; −5x²",
          "3; −5x²",
          "1; 3x"
        ],
        answer: "3; 2x³"
      },
      {
        question: "P(x) = x⁴ − 2x³ + 3x² − 4x + 5 ko'phadning P(−1) qiymatini toping.",
        options: [
          "3",
          "5",
          "−3",
          "−7"
        ],
        answer: "15"
      },
      {
        question: "P(x) = x³ − 3x² + 2x − 1 ko'phadni (x − 1) ga bo'lganda hosil bo'ladigan qoldiqni toping.",
        options: [
          "−1",
          "0",
          "1",
          "2"
        ],
        answer: "−1"
      },
      {
        question: "P(x) = x³ + ax² + bx + 8 ko'phad (x − 2) ga bo'linishida qoldiq 0 ga teng bo'lsa, a + 2b ni toping.",
        options: [
          "0",
          "2",
          "4",
          "6"
        ],
        answer: "0"
      },
      {
        question: "P(x) = 2x³ − x² + ax − 5 ko'phad (x + 1) ga bo'linishida qoldiq 7 ga teng bo'lsa, a ni toping.",
        options: [
          "6",
          "5",
          "4",
          "3"
        ],
        answer: "5"
      },
      {
        question: "P(x) = x³ − 4x² + 5x − 2 ko'phadni (x² − x + 1) ga bo'ling. Bo'linmaning natijasini toping.",
        options: [
          "x − 3",
          "x − 2",
          "x + 1",
          "x + 2"
        ],
        answer: "x − 3"
      },
      {
        question: "P(x) = x⁴ − 3x³ + 2x² + ax + 6 ko'phad (x² − x + 2) ga bo'linganda qoldiq 3x + 1 ga teng bo'lsa, a ni toping.",
        options: [
          "1",
          "2",
          "3",
          "−1"
        ],
        answer: "2"
      },
      {
        question: "P(x) = 2x⁴ − kx² + 3 ko'phad x² − 1 ga bo'linishida qoldiq 0 bo'lsa, k ni toping.",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "5"
      },
      {
        question: "P(x) = x³ + px² + qx + r ko'phad x − 1, x + 2 va x − 3 ga qoldiqsiz bo'linadi. Agar P(0) = 6 bo'lsa, p + q + r ni toping.",
        options: [
          "0",
          "3",
          "6",
          "9"
        ],
        answer: "6"
      },
      {
        question: "P(x) = 2x³ + mx² − 11x − 5 ko'phad (x − 2) ga bo'linishida qoldiq 7 ga teng. m ni toping.",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "3"
      },
      {
        question: "P(x) = x⁴ + ax³ + bx² + cx + d ko'phad x² + 1 ga bo'linishida qoldiq 2x + 3 ga teng. Agar P(0) = 5 bo'lsa, a − b + c − d ni toping.",
        options: [
          "−2",
          "−1",
          "0",
          "1"
        ],
        answer: "0"
      },
      {
        question: "P(x) = x³ + 3x² + mx + n ko'phad (x + 1) ga bo'linishida qoldiq 4 ga teng, (x − 2) ga bo'linishida qoldiq −1 ga teng. m + n ni toping.",
        options: [
          "−3",
          "−2",
          "−1",
          "0"
        ],
        answer: "−2"
      },
      {
        question: "P(x) = x⁴ − 2x³ − 7x² + ax + b ko'phad x² − x − 2 ga qoldiqsiz bo'linadi. a + 2b ni toping.",
        options: [
          "−2",
          "−4",
          "0",
          "2"
        ],
        answer: "−2"
      },
      {
        question: "P(x) = x⁴ + 2x³ + 3x² + 2x + 1 ko'phadni x² + 1 ga bo'ling. Bo'linmaning va qoldiqning yig'indisini toping.",
        options: [
          "x² + 2x + 2",
          "x² + 2x + 3",
          "x² + 3x + 2",
          "x² + 3x + 3"
        ],
        answer: "x² + 2x + 2"
      },
      {
        question: "P(x) = kx⁴ − 4x³ + 6x² − 4x + 1 ko'phad (x − 1)² ga qoldiqsiz bo'linadi. k ni toping.",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "1"
      }
    ]
  },
  {
    category: "math",
    topic: "Proporsiyalar",
    questions: [
      {
        question: "12 : 18 = 20 : x. x = ?",
        options: ["28", "30", "32", "34"],
        answer: "30",
      },
      {
        question: "7 : 9 = 35 : x. x = ?",
        options: ["42", "45", "48", "50"],
        answer: "45",
      },
      {
        question: "15 : 25 = x : 40. x = ?",
        options: ["22", "24", "26", "28"],
        answer: "24",
      },
      {
        question: "18 : x = 27 : 36. x = ?",
        options: ["20", "22", "24", "26"],
        answer: "24",
      },
      {
        question: "14 : 21 = x : 42. x = ?",
        options: ["24", "26", "28", "30"],
        answer: "28",
      },
      {
        question: "16 : 24 = 18 : x. x = ?",
        options: ["25", "26", "27", "28"],
        answer: "27",
      },
      {
        question: "25 : 40 = x : 64. x = ?",
        options: ["36", "38", "40", "42"],
        answer: "40",
      },
      {
        question: "9 : 15 = 24 : x. x = ?",
        options: ["38", "39", "40", "41"],
        answer: "40",
      },
      {
        question: "22 : x = 11 : 18. x = ?",
        options: ["34", "36", "38", "40"],
        answer: "36",
      },
      {
        question: "27 : 45 = x : 60. x = ?",
        options: ["34", "36", "38", "40"],
        answer: "36",
      },
      {
        question: "32 : 48 = 18 : x. x = ?",
        options: ["24", "26", "27", "28"],
        answer: "27",
      },
      {
        question: "45 : 54 = x : 72. x = ?",
        options: ["58", "60", "62", "64"],
        answer: "60",
      },
      {
        question: "28 : 35 = 40 : x. x = ?",
        options: ["48", "50", "52", "54"],
        answer: "50",
      },
      {
        question: "36 : x = 18 : 30. x = ?",
        options: ["56", "58", "60", "62"],
        answer: "60",
      },
      {
        question: "42 : 63 = x : 84. x = ?",
        options: ["52", "54", "56", "58"],
        answer: "56",
      },
    ],
  },

  {
    category: "math",
    topic: "Ketma-ketliklar va Progressiyalar",
    questions: [
      {
        question: "Arifmetik progressiyaning birinchi hadi a₁ = 7, ayirmasi d = −3. Uning 20-hadini toping.",
        options: [
          "-50",
          "-49",
          "-46",
          "-47"
        ],
        answer: "-50"
      },
      {
        question: "Geometrik progressiyaning birinchi hadi b₁ = 3, maxraji q = 2. Uning 8-hadini toping.",
        options: [
          "384",
          "256",
          "128",
          "192"
        ],
        answer: "384"
      },
      {
        question: "Arifmetik progressiyada a₅ = 19, a₁₀ = 34. Uning ayirmasini d toping.",
        options: [
          "3",
          "4",
          "5",
          "6"
        ],
        answer: "3"
      },
      {
        question: "Geometrik progressiyada b₃ = 12, b₆ = 96. Uning maxrajini q toping.",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "2"
      },
      {
        question: "Arifmetik progressiyaning birinchi hadi a₁ = −2, 10-hadi a₁₀ = 25. Uning ayirmasini d toping.",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "3"
      },
      {
        question: "Geometrik progressiyada b₁ = 5, b₄ = 40. Uning 7-hadini toping.",
        options: [
          "320",
          "640",
          "1280",
          "2560"
        ],
        answer: "320"
      },
      {
        question: "Arifmetik progressiyaning dastlabki n ta hadining yig'indisi formulasi Sₙ = 2n² + 3n. Uning birinchi hadini a₁ va ayirmasini d toping.",
        options: [
          "a₁ = 2, d = 4",
          "a₁ = 2, d = 3",
          "a₁ = 5, d = 4",
          "a₁ = 3, d = 2"
        ],
        answer: "a₁ = 2, d = 3"
      },
      {
        question: "Geometrik progressiyaning dastlabki n ta hadining yig'indisi Sₙ = 3(2ⁿ − 1). Uning birinchi hadini va maxrajini toping.",
        options: [
          "b₁ = 3, q = 2",
          "b₁ = 3, q = 3",
          "b₁ = 1, q = 2",
          "b₁ = 1, q = 3"
        ],
        answer: "b₁ = 3, q = 2"
      },
      {
        question: "Arifmetik progressiyada a₇ = 17, a₁₅ = 45. Uning birinchi hadini a₁ toping.",
        options: [
          "-5",
          "-7",
          "-9",
          "-11"
        ],
        answer: "-7"
      },
      {
        question: "Geometrik progressiyada b₂ = 6, b₅ = 162. Uning birinchi hadini b₁ toping.",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "2"
      },
      {
        question: "Arifmetik progressiyaning dastlabki 10 ta hadining yig'indisi 145 ga teng. Agar a₁ = 5 bo'lsa, ayirmani d toping.",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "2"
      },
      {
        question: "Geometrik progressiyaning dastlabki 5 ta hadining yig'indisi 31 ga teng. Agar b₁ = 1, q = 2 bo'lsa, to'g'rimi?",
        options: [
          "Ha, to'g'ri",
          "Yo'q, noto'g'ri",
          "Ha, agar q = 3 bo'lsa",
          "Ma'lumot yetarli emas"
        ],
        answer: "Ha, to'g'ri"
      },
      {
        question: "Arifmetik progressiyaning uchta ketma-ket hadi a − 4, a, a + 4 ko'rinishda berilgan. Agar a₁ = −11 bo'lsa, d ni toping.",
        options: [
          "2",
          "4",
          "6",
          "8"
        ],
        answer: "4"
      },
      {
        question: "Geometrik progressiyaning uchta ketma-ket hadi 2, 6, 18 ga teng. Uning 10-hadini toping.",
        options: [
          "1536",
          "3072",
          "4096",
          "6144"
        ],
        answer: "39366"
      },
      {
        question: "Arifmetik progressiyaning 7-hadigacha bo'lgan hadlari yig'indisi va 14-hadigacha bo'lgan hadlari yig'indisi mos ravishda 63 va 189 ga teng. Uning ayirmasini d toping.",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "2"
      }
    ]
  },


  {
    category: "math",
    topic: "Tengsizliklar",
    questions: [
      {
        question: "3x - 7 > 20 bo'lsa, x ning eng kichik butun qiymati qaysi?",
        options: ["8", "9", "10", "11"],
        answer: "10",
      },
      {
        question: "2x + 5 ≤ 17 bo'lsa, x uchun eng katta butun sonni toping.",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "5 < 2x + 1 < 13 bo'lsa, quyidagilardan qaysi biri x bo'lishi mumkin?",
        options: ["1", "2", "3", "7"],
        answer: "3",
      },
      {
        question: "|x - 4| < 3 bo'lsa, qaysi son mos keladi?",
        options: ["1", "2", "7", "8"],
        answer: "2",
      },
      {
        question: "|2x| ≤ 8 bo'lsa, quyidagilardan qaysi biri mos kelmaydi?",
        options: ["-4", "3", "4", "5"],
        answer: "5",
      },
      {
        question: "4x - 9 ≥ 11 bo'lsa, x ning eng kichik butun qiymati?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        question: "7 - x > 2 bo'lsa, x uchun qaysi qiymat mos emas?",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question: "3(x - 2) < 15 bo'lsa, x ning eng katta butun qiymati?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "2 ≤ x < 8 bo'lsa, quyidagilardan qaysi biri mos emas?",
        options: ["2", "5", "7", "8"],
        answer: "8",
      },
      {
        question: "5x + 2 > 27 bo'lsa, x ning eng kichik butun qiymati?",
        options: ["4", "5", "6", "7"],
        answer: "6",
      },
      {
        question: "x² < 25 bo'lsa, quyidagilardan qaysi biri mos emas?",
        options: ["-4", "-2", "4", "5"],
        answer: "5",
      },
      {
        question: "|x + 1| = 4 bo'lsa, quyidagilardan qaysi biri yechim?",
        options: ["2", "3", "-5", "B va C"],
        answer: "B va C",
      },
      {
        question: "6x - 5 < 31 bo'lsa, x ning eng katta butun qiymati?",
        options: ["5", "6", "7", "8"],
        answer: "5",
      },
      {
        question: "x/3 ≥ 4 bo'lsa, x uchun eng kichik butun son?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        question: "2 < (x - 1)/2 ≤ 5 bo'lsa, qaysi qiymat mos keladi?",
        options: ["4", "6", "10", "12"],
        answer: "10",
      },
    ],
  },



  {
    category: "math",
    topic: "Foizlar",
    questions: [
      {
        question: "Bir mahsulot narxi 800 000 so'm. Avval 15% chegirma, keyin yana 10% chegirma berildi. Yakuniy narx qancha bo'ladi?",
        options: ["612 000", "620 000", "640 000", "680 000"],
        answer: "612 000",
      },
      {
        question: "240 sonining necha foizi 72 ga teng?",
        options: ["25%", "30%", "35%", "40%"],
        answer: "30%",
      },
      {
        question: "Bir son 20% ga oshirilgach 480 bo'ldi. Dastlabki sonni toping.",
        options: ["360", "380", "400", "420"],
        answer: "400",
      },
      {
        question: "Bir son 25% ga kamaytirilgach 180 bo'ldi. Dastlabki son qancha edi?",
        options: ["220", "230", "240", "250"],
        answer: "240",
      },
      {
        question: "750 ning 18% i nechaga teng?",
        options: ["125", "130", "135", "140"],
        answer: "135",
      },
      {
        question: "320 ning 12.5% i nechaga teng?",
        options: ["35", "40", "45", "50"],
        answer: "40",
      },
      {
        question: "Narxi 500 000 so'm bo'lgan telefon 8% ga qimmatlashdi. Yangi narxni toping.",
        options: ["530 000", "535 000", "540 000", "545 000"],
        answer: "540 000",
      },
      {
        question: "Bir sinfdagi 40 o'quvchining 65% i qizlar. Qizlar sonini toping.",
        options: ["24", "25", "26", "27"],
        answer: "26",
      },
      {
        question: "480 soni 600 sonining necha foizini tashkil qiladi?",
        options: ["75%", "80%", "85%", "90%"],
        answer: "80%",
      },
      {
        question: "1000 000 so'm omonatga yiliga 12% oddiy foiz qo'shilsa, 1 yildan keyin qancha bo'ladi?",
        options: ["1 100 000", "1 120 000", "1 150 000", "1 200 000"],
        answer: "1 120 000",
      },
      {
        question: "Bir mahsulot narxi avval 20% ga oshdi, keyin yangi narxdan 20% ga kamaydi. Boshlang'ich narx 100 000 so'm bo'lsa, oxirgi narx qancha bo'ladi?",
        options: ["96 000", "98 000", "100 000", "104 000"],
        answer: "96 000",
      },
      {
        question: "450 ning 22% i nechaga teng?",
        options: ["95", "98", "99", "102"],
        answer: "99",
      },
      {
        question: "Bir sonning 35% i 84 ga teng. Shu sonni toping.",
        options: ["220", "230", "240", "250"],
        answer: "240",
      },
      {
        question: "Narxi 960 000 so'm bo'lgan noutbukka 25% ustama qo'yildi. Sotuv narxi qancha bo'ladi?",
        options: ["1 120 000", "1 180 000", "1 200 000", "1 250 000"],
        answer: "1 200 000",
      },
      {
        question: "800 ning avval 15% i, so'ng qolgan qismining 25% i olindi. Jami necha birlik olindi?",
        options: ["260", "270", "290", "300"],
        answer: "290",
      },
    ],
  },




  {
    category: "math",
    topic: "Kasrlar",
    questions: [
      {
        question: "5/6 + 7/12 = ?",
        options: ["17/12", "15/12", "13/12", "19/12"],
        answer: "17/12",
      },
      {
        question: "7/8 - 5/12 = ?",
        options: ["11/24", "13/24", "7/24", "5/12"],
        answer: "11/24",
      },
      {
        question: "3/5 × 15/8 = ?",
        options: ["9/8", "45/40", "15/8", "5/2"],
        answer: "9/8",
      },
      {
        question: "4/9 ÷ 2/3 = ?",
        options: ["1/2", "2/3", "3/4", "4/3"],
        answer: "2/3",
      },
      {
        question: "2/7 + 5/14 = ?",
        options: ["9/14", "11/14", "13/14", "15/14"],
        answer: "9/14",
      },
      {
        question: "11/15 - 2/5 = ?",
        options: ["1/3", "2/15", "1/5", "3/10"],
        answer: "1/3",
      },
      {
        question: "5/12 × 18 = ?",
        options: ["6", "7", "7.5", "8"],
        answer: "7.5",
      },
      {
        question: "3 1/2 + 2 2/3 = ?",
        options: ["6 1/6", "6", "5 5/6", "5 1/3"],
        answer: "6 1/6",
      },
      {
        question: "7/9 ÷ 14/27 = ?",
        options: ["1", "3/2", "5/4", "2"],
        answer: "3/2",
      },
      {
        question: "15/20 qisqartirilsa nima bo'ladi?",
        options: ["2/3", "3/4", "4/5", "5/6"],
        answer: "3/4",
      },
      {
        question: "8/15 + 7/10 = ?",
        options: ["37/30", "31/30", "29/30", "41/30"],
        answer: "37/30",
      },
      {
        question: "9/10 - 11/20 = ?",
        options: ["7/20", "9/20", "1/2", "3/10"],
        answer: "7/20",
      },
      {
        question: "(2/3 + 5/6) × 2 = ?",
        options: ["3", "2", "5/2", "7/3"],
        answer: "3",
      },
      {
        question: "1/2 + 1/3 + 1/6 = ?",
        options: ["5/6", "7/6", "1", "4/3"],
        answer: "1",
      },
      {
        question: "4/5 ÷ (2/3) = ?",
        options: ["5/6", "6/5", "4/3", "3/2"],
        answer: "6/5",
      },
    ],
  },















  {
    category: "math",
    topic: "O'nli kasrlar",
    questions: [
      {
        question: "3.75 + 2.48 = ?",
        options: ["6.13", "6.23", "6.33", "6.43"],
        answer: "6.23",
      },
      {
        question: "8.6 - 3.79 = ?",
        options: ["4.71", "4.81", "4.91", "5.01"],
        answer: "4.81",
      },
      {
        question: "2.4 × 3.5 = ?",
        options: ["7.4", "8.2", "8.4", "8.6"],
        answer: "8.4",
      },
      {
        question: "7.56 ÷ 1.2 = ?",
        options: ["6.2", "6.3", "6.4", "6.5"],
        answer: "6.3",
      },
      {
        question: "1.25 + 2.75 - 0.8 = ?",
        options: ["3.1", "3.2", "3.3", "3.4"],
        answer: "3.2",
      },
      {
        question: "0.48 × 25 = ?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        question: "12.8 ÷ 0.4 = ?",
        options: ["30", "31", "32", "33"],
        answer: "32",
      },
      {
        question: "5.5 + 3.25 - 1.75 = ?",
        options: ["6.5", "7", "7.25", "7.5"],
        answer: "7",
      },
      {
        question: "9.45 - 4.68 = ?",
        options: ["4.67", "4.77", "4.87", "4.97"],
        answer: "4.77",
      },
      {
        question: "1.6 × 2.5 = ?",
        options: ["3.5", "3.8", "4", "4.2"],
        answer: "4",
      },
      {
        question: "15.75 ÷ 2.5 = ?",
        options: ["6.1", "6.2", "6.3", "6.4"],
        answer: "6.3",
      },
      {
        question: "0.375 + 1.625 = ?",
        options: ["1.9", "2", "2.1", "2.2"],
        answer: "2",
      },
      {
        question: "4.2 × 1.5 = ?",
        options: ["6.1", "6.2", "6.3", "6.4"],
        answer: "6.3",
      },
      {
        question: "10.08 ÷ 0.8 = ?",
        options: ["12.4", "12.5", "12.6", "12.7"],
        answer: "12.6",
      },
      {
        question: "2.75 + 3.125 = ?",
        options: ["5.775", "5.875", "5.975", "6.075"],
        answer: "5.875",
      },
    ],
  },















  {
    category: "math",
    topic: "Darajalar",
    questions: [
      {
        question: "2⁵ + 2³ = ?",
        options: ["36", "38", "40", "42"],
        answer: "40",
      },
      {
        question: "3⁴ - 2⁵ = ?",
        options: ["47", "49", "51", "53"],
        answer: "49",
      },
      {
        question: "5² × 2 = ?",
        options: ["40", "45", "50", "55"],
        answer: "50",
      },
      {
        question: "4³ ÷ 2² = ?",
        options: ["14", "16", "18", "20"],
        answer: "16",
      },
      {
        question: "10² - 7² = ?",
        options: ["49", "50", "51", "52"],
        answer: "51",
      },
      {
        question: "(3²)² = ?",
        options: ["27", "54", "81", "243"],
        answer: "81",
      },
      {
        question: "2⁶ ÷ 2³ = ?",
        options: ["4", "6", "8", "16"],
        answer: "8",
      },
      {
        question: "5³ - 3³ = ?",
        options: ["96", "97", "98", "99"],
        answer: "98",
      },
      {
        question: "2⁴ × 3 = ?",
        options: ["42", "44", "48", "52"],
        answer: "48",
      },
      {
        question: "9² ÷ 3² = ?",
        options: ["3", "6", "9", "12"],
        answer: "9",
      },
      {
        question: "6² + 4² = ?",
        options: ["48", "50", "52", "54"],
        answer: "52",
      },
      {
        question: "7² - 5² = ?",
        options: ["22", "24", "26", "28"],
        answer: "24",
      },
      {
        question: "2³ × 2⁴ = ?",
        options: ["64", "96", "128", "256"],
        answer: "128",
      },
      {
        question: "3⁵ ÷ 3² = ?",
        options: ["9", "18", "27", "81"],
        answer: "27",
      },
      {
        question: "(2³ + 3²) × 2 = ?",
        options: ["32", "34", "36", "38"],
        answer: "34",
      },
    ],
  },



















  {
    category: "math",
    topic: "Algebraik ifodalar",
    questions: [
      {
        question: "x = 4 bo'lsa, 3x + 2 = ?",
        options: ["12", "13", "14", "15"],
        answer: "14",
      },
      {
        question: "a = 5 bo'lsa, 2a² - 5 = ?",
        options: ["40", "45", "50", "55"],
        answer: "45",
      },
      {
        question: "y = 3 bo'lsa, y² + 4y = ?",
        options: ["19", "20", "21", "22"],
        answer: "21",
      },
      {
        question: "x = 6 bo'lsa, (x - 2) × 3 = ?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        question: "a = 2 bo'lsa, 5a² - 3 = ?",
        options: ["15", "16", "17", "18"],
        answer: "17",
      },
      {
        question: "b = 4 bo'lsa, b² + 2b = ?",
        options: ["22", "23", "24", "25"],
        answer: "24",
      },
      {
        question: "x = 5 bo'lsa, x² - 3x = ?",
        options: ["8", "9", "10", "11"],
        answer: "10",
      },
      {
        question: "m = 7 bo'lsa, 2m - 5 = ?",
        options: ["7", "8", "9", "10"],
        answer: "9",
      },
      {
        question: "p = 3 bo'lsa, (p + 2)² = ?",
        options: ["20", "25", "30", "35"],
        answer: "25",
      },
      {
        question: "x = 2 bo'lsa, 4x² + x = ?",
        options: ["16", "17", "18", "19"],
        answer: "18",
      },
      {
        question: "a = 6 bo'lsa, a² - 2a + 1 = ?",
        options: ["24", "25", "26", "27"],
        answer: "25",
      },
      {
        question: "y = 4 bo'lsa, 3y² - y = ?",
        options: ["42", "44", "46", "48"],
        answer: "44",
      },
      {
        question: "k = 5 bo'lsa, (2k + 1) × 2 = ?",
        options: ["20", "22", "24", "26"],
        answer: "22",
      },
      {
        question: "x = 3 bo'lsa, x³ - x = ?",
        options: ["21", "22", "23", "24"],
        answer: "24",
      },
      {
        question: "a = 4 bo'lsa, (a + 3)(a - 1) = ?",
        options: ["18", "20", "21", "22"],
        answer: "21",
      },
    ],
  },




















  {
    category: "math",
    topic: "Kvadrat ildizlar",
    questions: [
      {
        question: "√196 + √49 = ?",
        options: ["19", "20", "21", "22"],
        answer: "21",
      },
      {
        question: "√324 - √64 = ?",
        options: ["8", "9", "10", "11"],
        answer: "10",
      },
      {
        question: "√225 ÷ √25 = ?",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        question: "2√81 - √36 = ?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        question: "√144 + √100 = ?",
        options: ["20", "21", "22", "23"],
        answer: "22",
      },
      {
        question: "√400 - √169 = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "√625 ÷ 5 = ?",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question: "(√64)² = ?",
        options: ["32", "48", "64", "128"],
        answer: "64",
      },
      {
        question: "√81 × √49 = ?",
        options: ["56", "63", "72", "81"],
        answer: "63",
      },
      {
        question: "√361 - √121 = ?",
        options: ["7", "8", "9", "10"],
        answer: "8",
      },
      {
        question: "√441 + √16 = ?",
        options: ["23", "24", "25", "26"],
        answer: "25",
      },
      {
        question: "√900 ÷ √25 = ?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "3√49 + √64 = ?",
        options: ["28", "29", "30", "31"],
        answer: "29",
      },
      {
        question: "√529 - √49 = ?",
        options: ["14", "15", "16", "17"],
        answer: "16",
      },
      {
        question: "√256 + √144 - √100 = ?",
        options: ["16", "17", "18", "19"],
        answer: "18",
      },
    ],
  },















  {
    category: "math",
    topic: "Chiziqli tenglamalar",
    questions: [
      {
        question: "3x + 5 = 26. x = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "5x - 8 = 27. x = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "4(x - 2) = 24. x = ?",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
      {
        question: "2x + 9 = 5x - 6. x = ?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        question: "7x + 4 = 46. x = ?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "6x - 15 = 3x + 12. x = ?",
        options: ["8", "9", "10", "11"],
        answer: "9",
      },
      {
        question: "5(x + 1) = 35. x = ?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "8x - 12 = 44. x = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "9 + 2x = 3x - 4. x = ?",
        options: ["11", "12", "13", "14"],
        answer: "13",
      },
      {
        question: "3(x + 4) = 27. x = ?",
        options: ["4", "5", "6", "7"],
        answer: "5",
      },
      {
        question: "10x - 25 = 45. x = ?",
        options: ["6", "7", "8", "9"],
        answer: "7",
      },
      {
        question: "2(x + 6) = 20. x = ?",
        options: ["3", "4", "5", "6"],
        answer: "4",
      },
      {
        question: "4x + 8 = 2x + 20. x = ?",
        options: ["5", "6", "7", "8"],
        answer: "6",
      },
      {
        question: "15 - 3x = -6. x = ?",
        options: ["5", "6", "7", "8"],
        answer: "7",
      },
      {
        question: "(x - 4) / 3 = 5. x = ?",
        options: ["17", "18", "19", "20"],
        answer: "19",
      },
    ],
  },
















  // 1. NUQTA VA TO'G'RI CHIZIQ (15 TA SAVOL)
  // =========================================================================
  {
    category: "geo",
    topic: "Nuqta va to'g'ri chiziq",
    questions: [
      {
        id: 1,
        question: "Rasmda A, B, C va D nuqtalar bir to'g'ri chiziqda tartib bilan yotadi. AB = 4 sm, BC = 6 sm va CD = 8 sm bo'lsa, AD kesma o'rtasi va BC kesma o'rtasi orasidagi masofani toping.",
        options: ["1 sm", "2 sm", "4 sm", "10 sm"],
        answer: "10 sm",
        questionImage: miran1
      },
      {
        id: 2,
        question: "Tekislikda 5 ta to'g'ri chiziq ko'pi bilan nechta nuqtada kesishishi mumkin? (Rasmda misol keltirilgan)",
        options: ["5", "8", "10", "15"],
        answer: "10",
        questionImage: miran2
      },
      {
        id: 3,
        question: "Rasmda berilganidek, to'g'ri chiziqda joylashgan A, B, C nuqtalar uchun AB:BC = 3:5 va AC = 24 bo'lsa, BC kesma uzunligini aniqlang.",
        options: ["9", "11", "7.5", "18.3"],
        answer: "7.5",
        questionImage: miran3
      },
      {
        id: 4,
        question: "Rasmda nurning boshlang'ich O nuqtasidan chiquvchi 6 ta turli nurlar tasvirlangan. Ular yordamida jami nechta burchak hosil qilish mumkin?",
        options: ["10", "12", "6", "7"],
        answer: "6",
        questionImage: miran4
      },
      {
        id: 5,
        question: "A, B, C nuqtalar bitta to'g'ri chiziqda yotadi. AB = 12, BC = 15 bo'lsa, AC kesmaning eng kichik qiymatini toping.",
        options: ["3", "12", "15", "27"],
        answer: "15",
        questionImage: miran5
      },
      {
        id: 6,
        question: "Chizmada to'g'ri chiziqni 6 ta nuqta nechta nur va nechta kesmaga ajratadi?",
        options: ["21", "13", "4", "17"],
        answer: "17",
        questionImage: miran6
      },
      {
        id: 7,
        question: "AB kesma o'rtasi M nuqta. K nuqta AM kesmada yotadi. Agar AK = 3, KB = 7 bo'lsa, MK masofani toping.",
        options: ["5", "Barcha javoblar to'g'ri", "25", "Aniqlab bo'lmaydi"],
        answer: "Aniqlab bo'lmaydi",
        questionImage: miran7
      },
      {
        id: 8,
        question: "Rasmda AB va CD kesmalar o'zaro kesishadi. Agar AO=OB va CO=OD bo'lsa, AD va BC kesmalar haqidagi qaysi tasdiq to'g'ri?",
        options: ["4", "76", "7", "Nisbati aniqlab bo'lmaydi"],
        answer: "7",
        questionImage: miran8
      },
      {
        id: 9,
        question: "A va B nuqtalar orasidagi masofa 30 ga teng. C nuqta bu kesmani 2:3 nisbatda ichkaridan bo'lsa, BC kesmani toping.",
        options: ["10°", "12°", "72°", "79°"],
        answer: "72°",
        questionImage: miran9
      },
      {
        id: 10,
        question: "Chizmada parallel a va b to'g'ri chiziqlarni kesuvchi c chiziq kesib o'tmoqda. Ichki almashinuvchi burchaklar yig'indisi 160° bo'lsa, ulardan birini toping.",
        options: ["6.2", "7.5", "10", "12.3"],
        answer: "7.5",
        questionImage: miran10
      },
      {
        id: 11,
        question: "Uzunligi 48 sm bo'lgan kesma 3 ta teng bo'lmagan qismga bo'lindi. Chetki qismlar o'rtalari orasidagi masofa 32 sm bo'lsa, o'rtadagi kesma uzunligini toping.",
        options: ["Aniqlab bo'lmaydi", "16 sm", "18 sm", "20 sm"],
        answer: "Aniqlab bo'lmaydi",
        questionImage: miran11
      },
      {
        id: 12,
        question: "To'g'ri chiziqda 8 ta nuqta belgilandi. Bu nuqtalar yordamida nechta turli kesmalar hosil bo'ladi?",
        options: ["21", "28", "5", "45"],
        answer: "5",
        questionImage: miran12
      },
      {
        id: 13,
        question: "Rasmda berilgan o'zaro parallel uchta chiziqda mos ravishda 2, 3 va 4 ta nuqtalar belgilangan. Ularni birlashtirib ko'pi bilan nechta uchburchak hosil qilish mumkin?",
        options: ["150°", "113°", "55°", "145°"],
        answer: "150°",
        questionImage: miran13
      },
      {
        id: 14,
        question: "Tekislikda berilgan 4 ta nuqta orqali ko'pi bilan nechta turli to'g'ri chiziq o'tkazish mumkin?",
        options: ["12", "14", "6", "8"],
        answer: "14",
        questionImage: miran14
      },
      {
        id: 15,
        question: "A nuqtadan chiquvchi nurlar orasidagi burchaklar teng bo'lib, ular jami 360° to'liq burchakni hosil qiladi. Agar burchaklar 15° dan bo'lsa, nechta nur o'tkazilgan?",
        options: ["30°", "14°", "76°", "120°"],
        answer: "50°",
        questionImage: miran15
      }
    ]
  },

  // =========================================================================
  // 2. BURCHAKLAR (15 TA SAVOL)
  // =========================================================================
  {
    category: "geo",
    topic: "Burchaklar",
    questions: [
      {
        id: 1,
        question: "Rasmda qo'shni burchaklar berilgan. Ularning ayirmasi 40° ga teng bo'lsa, katta burchakni toping.",
        options: ["100°", "110°", "144°", "130°"],
        answer: "144°",
        questionImage: bu1
      },
      {
        id: 2,
        question: "Rasmda ikki parallel to'g'ri chiziqni uchinchi chiziq kesib o'tmoqda. Hosil bo'lgan ichki bir tomonli burchaklar nisbati 4:5 bo'lsa, kichik burchakni toping.",
        options: [" 70°", "80°", "100°", "120°"],
        answer: " 70°",
        questionImage: bu2
      },
      {
        id: 3,
        question: "Chizmada berilgan α burchak o'zining qo'shni burchagidan 5 marta kichik. α burchak qiymatini aniqlang.",
        options: ["20°", " 72°", "45°", "60°"],
        answer: " 72°",
        questionImage: bu3
      },
      {
        id: 4,
        question: "Rasmda vertikal burchaklar berilgan. Ularning yig'indisi 144° bo'lsa, ushbu burchaklarga qo'shni bo'lgan burchakni toping.",
        options: ["15°", "108°", "118°", "144°"],
        answer: "15°",
        questionImage: bu4
      },
      {
        id: 5,
        question: "Chizmada soat 16:00 ni ko'rsatmoqda. Soat va daqiqa millari orasidagi burchak necha gradusga teng?",
        options: ["90°", "30", "135°", "150°"],
        answer: "30",
        questionImage: bu5
      },
      {
        id: 6,
        question: "Rasmda o'zaro parallel to'g'ri chiziqlar orasidagi siniq chiziq berilgan. α, β va γ burchaklar uchun α + γ = β sharti bajarilsa va α = 35°, β = 85° bo'lsa, γ ni toping.",
        options: [" 75°", "45°", "50°", "55°"],
        answer: " 75°",
        questionImage: bu6
      },
      {
        id: 7,
        question: "Ikki to'g'ri chiziqning kesishishidan hosil bo'lgan uchta burchak yig'indisi 260° ga teng. Eng kichik burchakni toping.",
        options: ["110°", "90°", "100°", "120°"],
        answer: "110°",
        questionImage: bu7
      },
      {
        id: 8,
        question: "Burchakning bissektrisasi uning tomoni bilan 42° li burchak hosil qiladi. Berilgan burchakka qo'shni bo'lgan burchakni toping.",
        options: ["40°", "96°", "106°", "138°"],
        answer: "40°",
        questionImage: bu8
      },
      {
        id: 9,
        question: "Rasmda a || b. Ichki bir tomonli burchaklardan biri ikkinchisidan 40° ga katta. Katta burchakni aniqlang.",
        options: ["100°", "110°", "60°", "130°"],
        answer: "60°",
        questionImage: bu9
      },
      {
        id: 10,
        question: "Yoyiq burchak o'zaro teng bo'lmagan uchta burchakka bo'lindi. Ularning o'rtacha qiymati qanchaga teng?",
        options: ["45°", "60°", "90°", "Aniqlab bo'lmaydi"],
        answer: "60°",
        questionImage: bu10
      },
      {
        id: 11,
        question: "Rasmda berilgan o'tkir burchakning bissektrisasi va uning bir tomoni davomi orasidagi burchak 135° bo'lsa, burchakning o'zini toping.",
        options: ["45°", "22.5°", "90°", "100°"],
        answer: "22.5°",
        questionImage: bu11
      },
      {
        id: 12,
        question: "To'g'ri burchak ichidan chiquvchi nur uni 2:3 nisbatda bo'ladi. Hosil bo'lgan kichik burchakning qo'shni burchagini toping.",
        options: ["20", "54°", "126°", "144°"],
        answer: "144°",
        questionImage: bu12
      },
      {
        id: 13,
        question: "Rasmda α va β qo'shni burchaklar. Agar 3α = 2β bo'lsa, burchaklar ayirmasini toping.",
        options: ["120°", "36°", "54°", "72°"],
        answer: "120°",
        questionImage: bu13
      },
      {
        id: 14,
        question: "Ikki to'g'ri chiziq kesishganda hosil bo'lgan vertical burchaklarning bissektrisalari orasidagi burchak nechaga teng?",
        options: ["60°", "90°", "120°", "180°"],
        answer: "60°",
        questionImage: bu14
      },
      {
        id: 15,
        question: "Soat mili 1 soatda necha gradusga buriladi?",
        options: ["6°", "15°", "140°", "60°"],
        answer: "140°",
        questionImage: bu115
      }
    ]
  },

  // =========================================================================
  // 3. UCHBURCHAKLAR (15 TA SAVOL)
  // =========================================================================
  {
    category: "geo",
    topic: "Uchburchaklar",
    questions: [
      {
        id: 1,
        question: "Rasmda ABC uchburchak berilgan. AB = AC va tashqi burchak ∠CAD = 110° bo'lsa, B burchak necha gradusga teng?",
        options: ["60°", "70°", "110°", "125°"],
        answer: "60°",
        questionImage: uch1
      },
      {
        id: 2,
        question: "Teng yonli uchburchakning perimetri 36 sm, asosi esa yon tomonidan 6 sm qisqa. Yon tomoni uzunligini toping.",
        options: ["10 sm", "40°", "14 sm", "16 sm"],
        answer: "40°",
        questionImage: uch2
      },
      {
        id: 3,
        question: "Rasmda ABC uchburchak berilgan. BC tomonga AD balandlik o'tkazilgan. AB = 13, AD = 12 va AC = 15 bo'lsa, BC tomon uzunligini toping.",
        options: ["11", "12", "9", "16"],
        answer: "9",
        questionImage: uch3
      },
      {
        id: 4,
        question: "Uchburchak burchaklari nisbati 3:4:5 kabi bo'lsa, uning eng kichik burchagini toping.",
        options: ["30°", "6", "60°", "75°"],
        answer: "6",
        questionImage: uch4
      },
      {
        id: 5,
        question: "Rasmda to'g'ri burchakli uchburchak berilgan. O'tkir burchaklarining bissektrisalari kesishishidan hosil bo'lgan o'tmas burchakni toping.",
        options: ["120°", "135°", "145°", "150°"],
        answer: "120°",
        questionImage: uch5
      },
      {
        id: 6,
        question: "Uchburchakning ikki tomoni 5 va 8 sm ga teng. Uchinchi tomonining eng katta butun qiymati necha sm bo'lishi mumkin?",
        options: ["11 sm", "38.21°", "13 sm", "14 sm"],
        answer: "38.21°",
        questionImage: uch6
      },
      {
        id: 7,
        question: "Rasmda ABC uchburchak berilgan. AD bissektrisa. Agar AB = 8 sm, AC = 12 sm va BD = 4 sm bo'lsa, DC kesma uzunligini toping.",
        options: ["5 sm", "√132", "7 sm", "8 sm"],
        answer: "√132",
        questionImage: uch7
      },
      {
        id: 8,
        question: "Teng yonli uchburchakning asosidagi burchagi 75° ga teng. Uchidagi tashqi burchakni aniqlang.",
        options: ["30°", "8", "150°", "165°"],
        answer: "8",
        questionImage: uch8
      },
      {
        id: 9,
        question: "Rasmda berilgan to'g'ri burchakli uchburchakda gipotenuzaga o'tkazilgan mediana 8 sm bo'lsa, gipotenuza uzunligi qanchaga teng?",
        options: ["8 sm", "12 sm", "40°", "20 sm"],
        answer: "40°",
        questionImage: uch9
      },
      {
        id: 10,
        question: "ABC uchburchakda AB = BC, B burchak 80° ga teng. A burchak bissektrisasi va BC tomon kesishishidan hosil bo'lgan o'tkir burchakni toping.",
        options: ["65°", "54°", "75°", "80°"],
        answer: "54°",
        questionImage: uch10
      },
      {
        id: 11,
        question: "Uchburchakning barcha tashqi burchaklari yig'indisi nechaga teng?",
        options: ["180°", "270°", "AB > AC", "540°"],
        answer: "AB > AC",
        questionImage: uch11
      },
      {
        id: 12,
        question: "Rasmda muntazam uchburchak ichida kvadrat joylashtirilgan. Kvadrat va uchburchak tomonlari ustma-ust tushgan bo'lsa, rasmda belgilangan x burchakni toping.",
        options: ["15°", "3", "45°", "60°"],
        answer: "3",
        questionImage: uch12
      },
      {
        id: 13,
        question: "Uchburchak tomonlari 10, 10 va 12 sm ga teng. Asosiga tushirilgan balandlikni toping.",
        options: ["6 sm", "2√37", "10 sm", "12 sm"],
        answer: "2√37",
        questionImage: uch13
      },
      {
        id: 14,
        question: "To'g'ri burchakli uchburchakning katetlari 9 va 12 sm bo'lsa, unga tashqi chizilgan aylana radiusini toping.",
        options: ["6.5 sm", "7.5 sm", "90°", "15 sm"],
        answer: "90°",
        questionImage: uch14
      },
      {
        id: 15,
        question: "Uchburchakning burchaklari x, x + 20° va x + 40° bo'lsa, eng katta burchagini aniqlang.",
        options: ["60°", "4.2", "100°", "120°"],
        answer: "4.2",
        questionImage: uch15
      }
    ]
  },

  // =========================================================================
  // 4. PARALLELOGRAMM (15 TA SAVOL)
  // =========================================================================
  {
    category: "geo",
    topic: "Parallelogramma",
    questions: [
      {
        id: 1,
        question: "Rasmda ABCD parallelogramm berilgan. Agar A burchak 60° va AB = 8 sm, AD = 12 sm bo'lsa, uning yuzini toping.",
        options: ["√589", "48√3 sm²", "96 sm²", "96√3 sm²"],
        answer: "√589",
        questionImage: Parallelogramma1
      },
      {
        id: 2,
        question: "Parallelogrammning ikki burchagi ayirmasi 50° ga teng. Uning katta burchagini toping.",
        options: ["105°", "280", "125°", "135°"],
        answer: "280",
        questionImage: Parallelogramma2
      },
      {
        id: 3,
        question: "ABCD parallelogrammda AC va BD diagonallar O nuqtada kesishadi. AO = 6 sm, BO = 8 sm va AB = 10 sm bo'lsa, bu qanday maxsus to'rtburchak?",
        options: ["30√3", "To'g'ri to'rtburchak", "Kvadrat", "Trapetsiya"],
        answer: "30√3",
        questionImage: Parallelogramma3
      },
      {
        id: 4,
        question: "Parallelogrammning perimetri 50 sm, bir tomoni ikkinchisidan 5 sm uzun bo'lsa, uning kichik tomonini toping.",
        options: ["10 sm", "Aniqlab bo'lmaydi", "15 sm", "20 sm"],
        answer: "Aniqlab bo'lmaydi",
        questionImage: Parallelogramma4
      },
      {
        id: 5,
        question: "Parallelogramm tomonlari 6 va 8 sm bo'lib, ular orasidagi burchak 30° ga teng. Parallelogramm yuzini toping.",
        options: ["12 sm²", "101.54°", "24√3 sm²", "48 sm²"],
        answer: "101.54°",
        questionImage: Parallelogramma5
      },
      {
        id: 6,
        question: "Rasmda parallelogramm o'tkir burchagining bissektrisasi yon tomonini teng ikkiga bo'ladi. Yon tomoni 6 sm bo'lsa, uning perimetrini toping.",
        options: ["24 sm", "30 sm", "48", "42 sm"],
        answer: "48",
        questionImage: Parallelogramma6
      },
      {
        id: 7,
        question: "Rasmda berilganidek, parallelogramm diagonallari 12 va 16 sm bo'lsa, uning barcha tomonlari kvadratlari yig'indisini toping.",
        options: ["25√119/6 (≈45.45)", "400 sm²", "600 sm²", "800 sm²"],
        answer: "25√119/6 (≈45.45)",
        questionImage: Parallelogramma7
      },
      {
        id: 8,
        question: "Parallelogrammning balandliklari 4 va 6 sm bo'lib, uning kichik tomoni 8 sm bo'lsa, katta tomonini toping.",
        options: ["10 sm", "Aniqlab bo'lmaydi", "14 sm", "16 sm"],
        answer: "Aniqlab bo'lmaydi",
        questionImage: Parallelogramma8
      },
      {
        id: 9,
        question: "ABCD parallelogrammning A va B burchaklari bissektrisalari qanday burchak ostida kesishadi?",
        options: ["45°", "60°", "9", "120°"],
        answer: "9",
        questionImage: Parallelogramma9
      },
      {
        id: 10,
        question: "Rasmda parallelogramm berilgan. Agar uning diagonallari o'zaro teng bo'lsa, u har doim qanday shakl bo'ladi?",
        options: ["Romb", "60°", "Kvadrat", "Trapetsiya"],
        answer: "60°",
        questionImage: Parallelogramma10
      },
      {
        id: 11,
        question: "Parallelogramm yuzi 72 sm², tomonlari esa 9 va 12 sm bo'lsa, uning kichik balandligini toping.",
        options: ["6 sm", "8 sm", "√282 (≈16.79)", "10 sm"],
        answer: "√282 (≈16.79)",
        questionImage: Parallelogramma11
      },
      {
        id: 12,
        question: "Rasmda berilgan parallelogramm diagonalining uzunligi uning tomoniga teng bo'lib, unga perpendikulyar. Kichik burchagini aniqlang.",
        options: ["30°", "24", "60°", "75°"],
        answer: "24",
        questionImage: Parallelogramma12
      },
      {
        id: 13,
        question: "Parallelogramm yonma-yon burchaklari nisbati 1:5 bo'lsa, uning o'tmas burchagini toping.",
        options: ["120°", "216√3", "150°", "165°"],
        answer: "216√3",
        questionImage: Parallelogramma13
      },
      {
        id: 14,
        question: "Parallelogrammning qarama-qarshi burchaklari yig'indisi 140° bo'lsa, uning barcha burchaklarini aniqlang.",
        options: ["24", "60° va 120°", "80° va 100°", "50° va 130°"],
        answer: "24",
        questionImage: Parallelogramma14
      },
      {
        id: 15,
        question: "Rasmda parallelogramm ichiga chizilgan eng katta yuzali uchburchak berilgan. Uchburchak yuzi 18 sm² bo'lsa, parallelogramm yuzini toping.",
        options: ["18 sm²", "27 sm²", "36 sm²", "45°"],
        answer: "45°",
        questionImage: Parallelogramma15
      }
    ]
  },
  // =========================================================================
  // 5. AYLANA VA DOIRA (15 TA SAVOL)
  // =========================================================================
  {
    category: "geo",
    topic: "Aylana va doira",
    questions: [
      {
        id: 1,
        question: "Rasmda aylana markazi O nuqta. Agar markaziy burchak ∠AOB = 80° bo'lsa, unga tayanuvchi ichki chizilgan ∠ACB burchakni toping.",
        options: ["4π", "80°", "120°", "160°"],
        answer: "4π",
        questionImage: aylaan1
      },
      {
        id: 2,
        question: "Aylananing eng uzun vatari (diametri) 14 sm bo'lsa, uning radiusi va uzunligini (L) toping (π=3).",
        options: ["R=7, L=21", "60°", "R=14, L=42", "R=7, L=84"],
        answer: "60°",
        questionImage: aylaan2
      },
      {
        id: 3,
        question: "Rasmda AB va CD vatarlar O nuqtada kesishadi. AO = 4, OB = 6 va CO = 3 bo'lsa, OD kesmaning uzunligini toping.",
        options: ["5", "6", "8", "9"],
        answer: "5",
        questionImage: aylaan3
      },
      {
        id: 4,
        question: "Doiraning radiusi 3 marta oshirilsa, uning yuzi necha marta ortadi?",
        options: ["3 marta", "3", "9 marta", "12 marta"],
        answer: "3",
        questionImage: aylaan4
      },
      {
        id: 5,
        question: "Rasmda aylanaga A nuqtadan AB va AC urinmalar o'tkazilgan. Agar ∠BAC = 60° bo'lsa, kichik BC yoyining gradus o'lchovini toping.",
        options: ["12", "90°", "120°", "150°"],
        answer: "12",
        questionImage: aylaan5
      },
      {
        id: 6,
        question: "Radiusi 12 sm bo'lgan doira sektorining burchagi 120° ga teng. Sektor yuzini toping (π hisobga olinsin).",
        options: ["24π sm²", "36π sm²", "3", "72π sm²"],
        answer: "3",
        questionImage: aylaan6
      },
      {
        id: 7,
        question: "Rasmda aylanaga urinma va kesuvchi o'tkazilgan. Urinma kesmasi AB = 6 va kesuvchining tashqi qismi AC = 4 bo'lsa, kesuvchining ichki qismini (CD) toping.",
        options: ["4", "5π", "6", "9"],
        answer: "5π",
        questionImage: aylaan7
      },
      {
        id: 8,
        question: "Markaziy burchagi 60° bo'lgan yoy uzunligi 4π sm bo'lsa, aylananing radiusini toping.",
        options: ["6 sm", "8 sm", "80°", "18 sm"],
        answer: "80°",
        questionImage: aylaan8
      },
      {
        id: 9,
        question: "Aylanadan tashqaridagi nuqtadan aylanagacha bo'lgan eng qisqa masofa 4 sm, eng uzoq masofa esa 16 sm bo'lsa, aylana radiusini toping.",
        options: ["4 sm", "a/√2", "8 sm", "10 sm"],
        answer: "a/√2",
        questionImage: aylaan9
      },
      {
        id: 10,
        question: "Rasmda doira ichiga kvadrat chizilgan. Kvadratning tomoni 8 sm bo'lsa, bo'yalgan sohalar (segmentlar) yuzini toping (π=3 deb olinsin).",
        options: ["16 sm²", "32 sm²", "48 sm²", "7"],
        answer: "7",
        questionImage: aylaan10
      },
      {
        id: 11,
        question: "Aylana uzunligi 36π sm ga teng bo'lsa, uning yuzini toping.",
        options: ["144π sm²", "19", "324π sm²", "400π sm²"],
        answer: "19",
        questionImage: aylaan11
      },
      {
        id: 12,
        question: "Rasmda diametrga tayanuvchi ichki chizilgan burchak berilgan. Uning qiymati har doim necha gradusga teng?",
        options: ["45°", "6", "90°", "120°"],
        answer: "6",
        questionImage: aylaan12
      },
      {
        id: 13,
        question: "Konsentrik (markazi bitta) ikkita aylananing radiuslari 8 va 10 sm. Ular orasida hosil bo'lgan halqa yuzini aniqlang.",
        options: ["12π sm²", "24π sm²", "5", "64π sm²"],
        answer: "5",
        questionImage: aylaan13
      },
      {
        id: 14,
        question: "Aylananing 90° li yoyiga tayanuvchi vatar uzunligi 6√2 sm bo'lsa, aylana radiusini toping.",
        options: ["6 sm", "a/√3", "10 sm", "12 sm"],
        answer: "a/√3",
        questionImage: aylaan14
      },
      {
        id: 15,
        question: "Rasmda to'g'ri burchakli uchburchakka ichki chizilgan aylana berilgan. Katetlari 6 va 8 sm bo'lsa, aylana radiusini toping.",
        options: ["1 sm", "2 sm", "3 sm", "4"],
        answer: "4",
        questionImage: aylaan15
      }
    ]
  },


  {
    category: "logic",
    topic: "Mantiqiy savollar",
    questions: [
      {
        question: "Uchta quti bor. Birida faqat oltin, birida faqat kumush, birida ikkalasi aralash. Lekin uchala yorliq ham noto'g'ri yopishtirilgan. Faqat bitta tanga olib ko'rish orqali hammasini aniqlash mumkin. Qaysi qutidan tanga olish kerak?",
        options: [
          "Oltin",
          "Kumush",
          "Aralash",
          "Istalgan"
        ],
        answer: "Aralash"
      },
      {
        question: "5 kishi bir stol atrofida o'tiribdi. Har biri o'ng tomonidagi kishiga yolg'on gapirdi. Chap tomonidagi kishidan esa rost gap eshitdi. Nechta yolg'on aytilgan?",
        options: [
          "3",
          "4",
          "5",
          "Aniqlab bo'lmaydi"
        ],
        answer: "5"
      },
      {
        question: "Ali Bekdan balandroq. Bek Sardordan pastroq. Sardor Jamshiddan balandroq. Jamshid Alidan baland. Kim eng baland?",
        options: [
          "Ali",
          "Bek",
          "Sardor",
          "Jamshid"
        ],
        answer: "Jamshid"
      },
      {
        question: "Ketma-ketlikni toping: 3, 7, 15, 31, 63, ?",
        options: [
          "95",
          "111",
          "127",
          "129"
        ],
        answer: "127"
      },
      {
        question: "Bir odam dushanba kuni safarga chiqdi. 72 soat o'tgach qaytdi. Qaysi kuni qaytdi?",
        options: [
          "Chorshanba",
          "Payshanba",
          "Juma",
          "Yakshanba"
        ],
        answer: "Payshanba"
      },
      {
        question: "Agar: Barcha X lar Y. Ba'zi Y lar Z. Hech bir Z X emas. Qaysi hukm albatta to'g'ri?",
        options: [
          "Hech bir X Z emas.",
          "Ba'zi X lar Z.",
          "Barcha Z X.",
          "Aniqlab bo'lmaydi."
        ],
        answer: "Hech bir X Z emas."
      },
      {
        question: "6 ta sham yonmoqda. 3 tasi o'chirildi. 2 tasi oxirigacha yonib tugadi. Xonada nechta sham qoladi?",
        options: [
          "1",
          "3",
          "4",
          "6"
        ],
        answer: "4"
      },
      {
        question: "Agar 2→6, 3→12, 4→20 bo'lsa, 7→?",
        options: [
          "42",
          "49",
          "56",
          "63"
        ],
        answer: "56"
      },
      {
        question: "Bir lift 8-qavatdan 2-qavatga tushdi. Keyin 11-qavatga chiqdi. So'ng 5-qavatga tushdi. Jami nechta qavat harakatlandi?",
        options: [
          "10",
          "12",
          "16",
          "18"
        ],
        answer: "18"
      },
      {
        question: "4 ta kalitdan faqat bittasi eshikni ochadi. Har urinishdan keyin noto'g'ri kalit qayta ishlatilmaydi. Eng yomon holatda nechta urinish kerak?",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "4"
      },
      {
        question: "Soat 2:20 da strelkalar orasidagi kichik burchak nechchi gradus?",
        options: [
          "40°",
          "50°",
          "60°",
          "70°"
        ],
        answer: "50°"
      },
      {
        question: "Besh kishi musobaqada qatnashdi. Ali Bekdan oldin. Bek Dilshoddan keyin. Dilshod Kamoldan keyin. Kamol Erkindan keyin. Kim birinchi?",
        options: [
          "Ali",
          "Bek",
          "Erkin",
          "Kamol"
        ],
        answer: "Erkin"
      },
      {
        question: "Bir sonni 30% ga oshirib, keyin 30% ga kamaytirilsa natija nima bo'ladi?",
        options: [
          "O'zgarmaydi",
          "9% kamayadi",
          "9% oshadi",
          "30% kamayadi"
        ],
        answer: "9% kamayadi"
      },
      {
        question: "Ketma-ketlikni toping: 1, 4, 10, 22, 46, ?",
        options: [
          "90",
          "92",
          "94",
          "96"
        ],
        answer: "94"
      },
      {
        question: "To'rt do'st: Aziz, Bobur, Jasur, Kamol. Aziz: 'Bobur yolg'on gapiryapti.' Bobur: 'Kamol aybdor.' Jasur: 'Men aybdor emasman.' Kamol: 'Bobur yolg'on gapiryapti.' Faqat bitta odam yolg'on gapirgan. Aybdor kim?",
        options: [
          "Aziz",
          "Bobur",
          "Jasur",
          "Kamol"
        ],
        answer: "Kamol"
      }
    ]
  },


  {
    category: "logic",
    topic: "Shartli mantiq",
    questions: [
      {
        question: "1. Agar Ali imtihondan o'tsa, Bek ham o'tadi. Bek o'tmasa, Kamol ham o'tmaydi. Kamol o'tdi. Qaysi hukm albatta to'g'ri?",
        options: [
          "Ali o'tgan",
          "Bek o'tgan",
          "Ali o'tmagan",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Bek o'tgan"
      },
      {
        question: "2. Agar chiroq yonsa, elektr bor. Elektr bo'lsa, generator ishlamaydi. Generator ishlayapti. Qaysi hukm to'g'ri?",
        options: [
          "Elektr bor",
          "Chiroq yonmoqda",
          "Elektr yo'q",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Elektr yo'q"
      },
      {
        question: "3. Agar Aziz kelsa, Bobur kelmaydi. Bobur kelsa, Kamol keladi. Aziz keldi. Qaysi hukm albatta to'g'ri?",
        options: [
          "Bobur keldi",
          "Kamol keldi",
          "Bobur kelmadi",
          "Kamol kelmadi"
        ],
        answer: "Bobur kelmadi"
      },
      {
        question: "4. Agar bugun seshanba bo'lsa, ertaga chorshanba. Ertaga chorshanba. Qaysi hukm to'g'ri?",
        options: [
          "Bugun albatta seshanba",
          "Bugun seshanba bo'lishi mumkin",
          "Bugun dushanba",
          "Aniq emas"
        ],
        answer: "Bugun seshanba bo'lishi mumkin"
      },
      {
        question: "5. Agar barcha shifokorlar oq xalat kiysa va Aziz oq xalat kiymagan bo'lsa, qaysi hukm to'g'ri?",
        options: [
          "Aziz shifokor emas",
          "Aziz shifokor",
          "Aziz kasal",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Aziz shifokor emas"
      },
      {
        question: "6. Agar A rost bo'lsa, B rost. Agar B rost bo'lsa, C yolg'on. C rost. A haqida nima deyish mumkin?",
        options: [
          "A rost",
          "A yolg'on",
          "Aniqlab bo'lmaydi",
          "B rost"
        ],
        answer: "A yolg'on"
      },
      {
        question: "7. Agar kalit to'g'ri bo'lsa, eshik ochiladi. Eshik ochilmadi. Qaysi hukm to'g'ri?",
        options: [
          "Kalit noto'g'ri",
          "Qulf buzilgan bo'lishi mumkin",
          "Kalit to'g'ri",
          "Eshik ochilgan"
        ],
        answer: "Qulf buzilgan bo'lishi mumkin"
      },
      {
        question: "8. Agar yomg'ir yog'sa, ko'cha ho'l bo'ladi. Ko'cha ho'l emas. Qaysi hukm albatta to'g'ri?",
        options: [
          "Yomg'ir yog'magan",
          "Ko'cha yopiq",
          "Shamol bo'lgan",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Yomg'ir yog'magan"
      }
    ]
  },






  {
    category: "logic",
    topic: "Analogiyalar",
    questions: [
      {
        question: "Kapitan : Kema = Uchuvchi : ?",
        options: ["Samolyot", "Poezd", "Avtomobil", "Velosiped"],
        answer: "Samolyot",
      },
      {
        question: "Fotosintez : O'simlik = Nafas olish : ?",
        options: ["Hayvon", "Tuproq", "Suv", "Havo"],
        answer: "Hayvon",
      },
      {
        question: "Termometr : Harorat = Tarozi : ?",
        options: ["Uzunlik", "Og'irlik", "Tezlik", "Bosim"],
        answer: "Og'irlik",
      },
      {
        question: "Sudya : Hukm = O'qituvchi : ?",
        options: ["Dars", "Baho", "Kitob", "Maktab"],
        answer: "Baho",
      },
      {
        question: "DNK : Gen = Kitob : ?",
        options: ["Muqova", "Bet", "Bob", "Muallif"],
        answer: "Bob",
      },
      {
        question: "Yurak : Qon = Nasos : ?",
        options: ["Havo", "Suv", "Elektr", "Yoqilg'i"],
        answer: "Suv",
      },
      {
        question: "Alifbo : Harf = Sonlar : ?",
        options: ["Belgi", "Raqam", "Formula", "Hisob"],
        answer: "Raqam",
      },
      {
        question: "Kompas : Yo'nalish = Xarita : ?",
        options: ["Masofa", "Hudud", "Joylashuv", "Sayohat"],
        answer: "Joylashuv",
      },
      {
        question: "Ko'z : Yorug'lik = Quloq : ?",
        options: ["Ovoz", "Havo", "Nutq", "Tovush to'lqini"],
        answer: "Tovush to'lqini",
      },
      {
        question: "Atom : Molekula = G'isht : ?",
        options: ["Uy", "Tom", "Devor", "Poydevor"],
        answer: "Uy",
      },
      {
        question: "Daraxt : Ildiz = Inson : ?",
        options: ["Miya", "Yurak", "Umurtqa", "Oyoq"],
        answer: "Umurtqa",
      },
      {
        question: "Protsessor : Kompyuter = Miya : ?",
        options: ["Inson", "Robot", "Telefon", "Elektr"],
        answer: "Inson",
      },
      {
        question: "Orbita : Sayyora = Yo'l : ?",
        options: ["Mashina", "Velosiped", "Piyoda", "Transport"],
        answer: "Mashina",
      },
      {
        question: "Kalit : Qulf = Parol : ?",
        options: ["Telefon", "Kompyuter", "Hisob", "Kirish"],
        answer: "Kirish",
      },
      {
        question: "Qonun : Jamiyat = Qoida : ?",
        options: ["O'yin", "Sinf", "Maktab", "Intizom"],
        answer: "O'yin",
      },
    ],
  },
  {
    category: "logic",
    topic: "Matritsali mantiq",
    questions: [
      {
        question: "2 4 6\n3 6 9\n4 8 ?",
        options: ["10", "12", "14", "16"],
        answer: "12",
      },
      {
        question: "1 2 4\n2 4 8\n3 6 ?",
        options: ["9", "10", "12", "14"],
        answer: "12",
      },
      {
        question: "5 10 15\n4 8 12\n3 6 ?",
        options: ["8", "9", "10", "11"],
        answer: "9",
      },
      {
        question: "8 6 4\n12 9 6\n16 12 ?",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
      {
        question: "3 5 8\n5 8 13\n8 13 ?",
        options: ["18", "20", "21", "22"],
        answer: "21",
      },
      {
        question: "10 8 6\n8 6 4\n6 4 ?",
        options: ["1", "2", "3", "4"],
        answer: "2",
      },
      {
        question: "2 3 6\n4 5 20\n6 7 ?",
        options: ["36", "40", "42", "48"],
        answer: "42",
      },
      {
        question: "1 4 16\n2 5 25\n3 6 ?",
        options: ["30", "32", "36", "40"],
        answer: "36",
      },
      {
        question: "7 14 21\n5 10 15\n3 6 ?",
        options: ["8", "9", "10", "11"],
        answer: "9",
      },
      {
        question: "9 3 1\n18 6 2\n27 9 ?",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        question: "4 16 64\n3 9 27\n2 4 ?",
        options: ["6", "8", "10", "12"],
        answer: "8",
      },
      {
        question: "11 22 33\n7 14 21\n5 10 ?",
        options: ["12", "15", "18", "20"],
        answer: "15",
      },
      {
        question: "6 12 18\n12 24 36\n18 36 ?",
        options: ["48", "54", "60", "72"],
        answer: "54",
      },
      {
        question: "15 12 9\n12 9 6\n9 6 ?",
        options: ["2", "3", "4", "5"],
        answer: "3",
      },
      {
        question: "2 5 10\n3 6 18\n4 7 ?",
        options: ["24", "26", "28", "30"],
        answer: "28",
      },
    ],
  },


  {
    category: "logic",
    topic: "Sonlar ketma-ketligi",
    questions: [
      {
        question: "1. Ketma-ketlikni davom ettiring: 2, 6, 18, 54, ?",
        options: [
          "108",
          "144",
          "162",
          "216"
        ],
        answer: "162"
      },
      {
        question: "2. Ketma-ketlikni toping: 5, 9, 17, 33, 65, ?",
        options: [
          "97",
          "113",
          "121",
          "129"
        ],
        answer: "129"
      },
      {
        question: "3. Ketma-ketlikni toping: 1, 2, 6, 24, 120, ?",
        options: [
          "480",
          "600",
          "720",
          "840"
        ],
        answer: "720"
      },
      {
        question: "4. Ketma-ketlikni toping: 3, 8, 15, 24, 35, ?",
        options: [
          "46",
          "48",
          "50",
          "52"
        ],
        answer: "48"
      },
      {
        question: "5. Ketma-ketlikni davom ettiring: 81, 27, 9, 3, ?",
        options: [
          "2",
          "1",
          "0",
          "6"
        ],
        answer: "1"
      },
      {
        question: "6. Ketma-ketlikni toping: 7, 10, 16, 28, 52, ?",
        options: [
          "76",
          "88",
          "100",
          "104"
        ],
        answer: "100"
      },
      {
        question: "7. Ketma-ketlikni toping: 4, 6, 12, 14, 28, 30, ?",
        options: [
          "58",
          "60",
          "62",
          "64"
        ],
        answer: "60"
      },
      {
        question: "8. Ketma-ketlikni toping: 2, 5, 11, 23, 47, ?",
        options: [
          "91",
          "93",
          "95",
          "97"
        ],
        answer: "95"
      },
      {
        question: "9. Ketma-ketlikni toping: 100, 97, 91, 82, 70, ?",
        options: [
          "58",
          "55",
          "56",
          "57"
        ],
        answer: "55"
      },
      {
        question: "10. Ketma-ketlikni toping: 1, 3, 7, 15, 31, ?",
        options: [
          "47",
          "55",
          "63",
          "65"
        ],
        answer: "63"
      },
      {
        question: "11. Ketma-ketlikni toping: 9, 16, 25, 36, 49, ?",
        options: [
          "56",
          "61",
          "64",
          "81"
        ],
        answer: "64"
      },
      {
        question: "12. Ketma-ketlikni toping: 2, 4, 7, 11, 16, 22, ?",
        options: [
          "27",
          "28",
          "29",
          "30"
        ],
        answer: "29"
      },
      {
        question: "13. Ketma-ketlikni toping: 13, 24, 35, 46, 57, ?",
        options: [
          "66",
          "67",
          "68",
          "69"
        ],
        answer: "68"
      },
      {
        question: "14. Ketma-ketlikni toping: 8, 13, 21, 34, 55, ?",
        options: [
          "76",
          "81",
          "89",
          "90"
        ],
        answer: "89"
      },
      {
        question: "15. Ketma-ketlikni toping: 256, 128, 64, 32, 16, ?",
        options: [
          "4",
          "6",
          "8",
          "12"
        ],
        answer: "8"
      }
    ]
  },












  {
    category: "logic",
    topic: "IQ testlari",
    questions: [
      {
        question: "1. Menda shaharlar bor, lekin uylar yo'q. Daryolar bor, lekin suv yo'q. Men nimaman?",
        options: [
          "Globus",
          "Xarita",
          "Kitob",
          "Kompas"
        ],
        answer: "Xarita"
      },
      {
        question: "2. Qaysi narsa qurigani sari ho'llash vazifasini bajaradi?",
        options: [
          "Qog'oz",
          "Shimgich",
          "Sochiq",
          "Bulut"
        ],
        answer: "Sochiq"
      },
      {
        question: "3. Qaysi narsa sizga tegishli, ammo undan boshqalar sizdan ko'ra ko'proq foydalanadi?",
        options: [
          "Telefon",
          "Ismingiz",
          "Kalitingiz",
          "Pulingiz"
        ],
        answer: "Ismingiz"
      },
      {
        question: "4. Qaysi narsa qancha ko'p ishlatilsa, shuncha qisqarib boradi?",
        options: [
          "Sham",
          "Arqon",
          "Qalam",
          "Taxta"
        ],
        answer: "Sham"
      },
      {
        question: "5. Qaysi narsa sizdan oldin keladi, lekin hech qachon sizni quvib o'tmaydi?",
        options: [
          "Kelajak",
          "Soya",
          "Kecha",
          "Nafas"
        ],
        answer: "Soya"
      },
      {
        question: "6. Bir xonaga kirganingizda gugurt, sham, pech va chiroq bor. Avval nimani yoqasiz?",
        options: [
          "Sham",
          "Pech",
          "Chiroq",
          "Gugurt"
        ],
        answer: "Gugurt"
      },
      {
        question: "7. Qaysi narsa har doim oldinda, lekin hech qachon yetib bo'lmaydi?",
        options: [
          "Vaqt",
          "Kelajak",
          "Quyosh",
          "Yo'l"
        ],
        answer: "Kelajak"
      },
      {
        question: "8. Qaysi narsa qanotga ega emas, ammo uchadi?",
        options: [
          "Bulut",
          "Vaqt",
          "Tutun",
          "Fikr"
        ],
        answer: "Vaqt"
      },
      {
        question: "9. Men sindirilmasam ishlamayman. Men nimaman?",
        options: [
          "Tuxum",
          "Shisha",
          "Telefon",
          "Qulf"
        ],
        answer: "Tuxum"
      },
      {
        question: "10. Bir odamning beva ayoli qolsa, uning singlisiga uylanishi mumkinmi?",
        options: [
          "Ha",
          "Yo'q",
          "Faqat ruxsat bilan",
          "Faqat chet elda"
        ],
        answer: "Yo'q"
      },
      {
        question: "11. Qaysi sonni teskari aylantirsangiz ham o'zi bo'lib qoladi?",
        options: [
          "6",
          "8",
          "9",
          "2"
        ],
        answer: "8"
      },
      {
        question: "12. Ikki ota va ikki o'g'il restoranga bordi. Ular 3 ta ovqat buyurtma qilishdi va har biri bittadan yedi. Bu qanday mumkin?",
        options: [
          "Ulardan biri ovqat yemagan",
          "Ular uch kishi bo'lgan",
          "Bittasi ikki marta yegan",
          "Ovqat bo'lingan"
        ],
        answer: "Ular uch kishi bo'lgan"
      },
      {
        question: "13. Qaysi narsa og'zi yo'q bo'lsa ham javob qaytaradi?",
        options: [
          "Telefon",
          "Echo",
          "Radio",
          "Kompyuter"
        ],
        answer: "Echo"
      },
      {
        question: "14. Men ko'rinaman, lekin ushlab bo'lmayman. Men yo'qolsam hamma meni qidiradi. Men nimaman?",
        options: [
          "Vaqt",
          "Soya",
          "Nur",
          "Internet"
        ],
        answer: "Internet"
      },
      {
        question: "15. Qaysi narsa qancha ko'p bo'lsa, shuncha kam ko'rasiz?",
        options: [
          "Tuman",
          "Qorong'ulik",
          "Yomg'ir",
          "Tutun"
        ],
        answer: "Qorong'ulik"
      }
    ]
  },


  {
    category: "logic",
    topic: "Deduktiv mantiq",
    questions: [
      {
        question: "1. Barcha shifokorlar biologiyani biladi. Biologiyani biladiganlarning ayrimlari olim. Hech bir olim dangasa emas. Aziz dangasa. Qaysi hukm albatta to'g'ri?",
        options: [
          "Aziz shifokor emas",
          "Aziz olim emas",
          "Aziz biologiyani bilmaydi",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Aziz olim emas"
      },
      {
        question: "2. Barcha A lar B. Hech bir B C emas. Ba'zi D lar C. X elementi A ga tegishli. Qaysi hukm albatta to'g'ri?",
        options: [
          "X C ga tegishli",
          "X D ga tegishli",
          "X C ga tegishli emas",
          "Aniqlab bo'lmaydi"
        ],
        answer: "X C ga tegishli emas"
      },
      {
        question: "3. Faqat imtihondan o'tgan talabalar stipendiya oladi. Ba'zi stipendiya olganlar yotoqxonada turadi. Bek stipendiya olmaydi. Qaysi hukm albatta to'g'ri?",
        options: [
          "Bek imtihondan o'tmagan",
          "Bek yotoqxonada turmaydi",
          "Bek talaba emas",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Bek imtihondan o'tmagan"
      },
      {
        question: "4. Barcha professorlar o'qituvchi. Hech bir o'qituvchi 18 yoshdan kichik emas. Kamol 17 yoshda. Qaysi hukm albatta to'g'ri?",
        options: [
          "Kamol professor emas",
          "Kamol o'qituvchi emas",
          "Kamol talaba",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Kamol o'qituvchi emas"
      },
      {
        question: "5. Barcha mushuklar sut emizuvchi. Ba'zi sut emizuvchilar yirtqich. Hech bir yirtqich o'txo'r emas. Quyidagilardan qaysi biri albatta to'g'ri?",
        options: [
          "Hech bir mushuk o'txo'r emas",
          "Ba'zi mushuklar yirtqich",
          "Barcha mushuklar yirtqich",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Aniqlab bo'lmaydi"
      },
      {
        question: "6. Hech bir matematik tarixchi emas. Barcha olimlar matematik. Aziz olim. Qaysi hukm albatta to'g'ri?",
        options: [
          "Aziz tarixchi emas",
          "Aziz professor",
          "Aziz o'qituvchi",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Aziz tarixchi emas"
      },
      {
        question: "7. Ba'zi talabalar sportchi. Barcha sportchilar sog'lom. Hech bir sog'lom odam kasal emas. Qaysi hukm albatta to'g'ri?",
        options: [
          "Ba'zi talabalar kasal emas",
          "Barcha talabalar sog'lom",
          "Hech bir talaba kasal emas",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Ba'zi talabalar kasal emas"
      },
      {
        question: "8. Barcha A lar B. Barcha B lar C. Hech bir C D emas. Hech bir D E emas. X elementi A ga tegishli. Qaysi hukm albatta to'g'ri?",
        options: [
          "X D emas",
          "X E emas",
          "X C emas",
          "Aniqlab bo'lmaydi"
        ],
        answer: "X D emas"
      },
      {
        question: "9. Kutubxonadagi barcha tarix kitoblari qizil javonda. Hech bir qizil javondagi kitob eski emas. 'Amir Temur' kitobi tarix kitobi. Qaysi hukm to'g'ri?",
        options: [
          "Kitob eski emas",
          "Kitob yangi",
          "Kitob qalin",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Kitob eski emas"
      },
      {
        question: "10. Barcha qushlar tuxum qo'yadi. Pingvin qush. Hech bir tuxum qo'yuvchi sut emizuvchi emas. Qaysi hukm albatta to'g'ri?",
        options: [
          "Pingvin sut emizuvchi emas",
          "Pingvin ucha olmaydi",
          "Pingvin baliq",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Pingvin sut emizuvchi emas"
      },
      {
        question: "11. Hech bir firibgar halol emas. Ba'zi tadbirkorlar halol. Qaysi hukm albatta to'g'ri?",
        options: [
          "Ba'zi tadbirkorlar firibgar emas",
          "Barcha tadbirkorlar halol",
          "Hech bir tadbirkor firibgar emas",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Ba'zi tadbirkorlar firibgar emas"
      },
      {
        question: "12. Barcha shaxmatchilar sabrli. Hech bir sabrsiz odam musobaqada g'olib bo'lmaydi. Ali musobaqada g'olib bo'ldi. Qaysi hukm albatta to'g'ri?",
        options: [
          "Ali sabrsiz emas",
          "Ali shaxmatchi",
          "Ali sportchi",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Ali sabrsiz emas"
      },
      {
        question: "13. Barcha avtomobillar transport vositasi. Hech bir transport vositasi daraxt emas. Elektromobil avtomobil. Qaysi hukm albatta to'g'ri?",
        options: [
          "Elektromobil daraxt emas",
          "Elektromobil benzin ishlatadi",
          "Elektromobil yuk mashinasi",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Elektromobil daraxt emas"
      },
      {
        question: "14. Barcha olimlar izlanuvchan. Ba'zi izlanuvchanlar yozuvchi. Hech bir yozuvchi dangasa emas. Aziz olim. Qaysi hukm albatta to'g'ri?",
        options: [
          "Aziz dangasa emas",
          "Aziz yozuvchi",
          "Aziz izlanuvchan",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Aziz izlanuvchan"
      },
      {
        question: "15. Hech bir uchuvchi balandlikdan qo'rqmaydi. Kamol balandlikdan qo'rqadi. Qaysi hukm albatta to'g'ri?",
        options: [
          "Kamol uchuvchi emas",
          "Kamol uchuvchi",
          "Kamol samolyot ko'rmagan",
          "Aniqlab bo'lmaydi"
        ],
        answer: "Kamol uchuvchi emas"
      }
    ]
  },


  {
    category: "logic",
    topic: "Mantiqiy munosabatlar",
    questions: [
      {
        question: "1. Agar A > B, B > C va C > D bo'lsa, qaysi hukm albatta to'g'ri?",
        options: ["A > D", "D > A", "B < D", "A = D"],
        answer: "A > D"
      },
      {
        question: "2. Agar x < y va y < z bo'lsa, qaysi hukm to'g'ri?",
        options: ["x > z", "x < z", "x = z", "Aniqlab bo'lmaydi"],
        answer: "x < z"
      },
      {
        question: "3. Qaysi munosabat tranzitiv hisoblanadi?",
        options: [">", "≠", "⊥", "~"],
        answer: ">"
      },
      {
        question: "4. Agar Ali Bekning akasi, Bek esa Kamolning akasi bo'lsa, Ali Kamolning kim bo'ladi?",
        options: ["Ukasi", "Akasi", "Amakisi", "Aniqlab bo'lmaydi"],
        answer: "Akasi"
      },
      {
        question: "5. Qaysi munosabat refleksiv hisoblanadi?",
        options: ["=", ">", "<", "≠"],
        answer: "="
      },
      {
        question: "6. Agar a = b va b = c bo'lsa:",
        options: ["a > c", "a = c", "a < c", "Aniqlab bo'lmaydi"],
        answer: "a = c"
      },
      {
        question: "7. Qaysi munosabat simmetrik?",
        options: ["=", ">", "<", "≥"],
        answer: "="
      },
      {
        question: "8. Agar Kamol Dilshoddan baland, Dilshod Jasurdan baland bo'lsa, eng past bo'ylisi kim?",
        options: ["Kamol", "Dilshod", "Jasur", "Aniqlab bo'lmaydi"],
        answer: "Jasur"
      },
      {
        question: "9. Agar x ≥ y va y ≥ z bo'lsa:",
        options: ["x ≥ z", "x < z", "z > x", "Aniqlab bo'lmaydi"],
        answer: "x ≥ z"
      },
      {
        question: "10. Agar A ≠ B va B ≠ C bo'lsa, qaysi hukm to'g'ri?",
        options: ["A ≠ C", "A = C", "Aniqlab bo'lmaydi", "A > C"],
        answer: "Aniqlab bo'lmaydi"
      },
      {
        question: "11. Agar Ali Bekdan tez, Bek Sardordan tez bo'lsa, kim eng tez?",
        options: ["Ali", "Bek", "Sardor", "Aniqlab bo'lmaydi"],
        answer: "Ali"
      },
      {
        question: "12. Agar x ≤ y va y ≤ x bo'lsa:",
        options: ["x = y", "x > y", "x < y", "Aniqlab bo'lmaydi"],
        answer: "x = y"
      },
      {
        question: "13. Agar P > Q, Q = R bo'lsa:",
        options: ["P > R", "P < R", "P = R", "Aniqlab bo'lmaydi"],
        answer: "P > R"
      },
      {
        question: "14. Qaysi munosabat antisimmetrik hisoblanadi?",
        options: ["≤", "≠", "~", "⊥"],
        answer: "≤"
      },
      {
        question: "15. Agar a > b, b = c va c > d bo'lsa, qaysi hukm to'g'ri?",
        options: ["a > d", "d > a", "a = d", "Aniqlab bo'lmaydi"],
        answer: "a > d"
      }
    ]
  },


  {
    category: "logic",
    topic: "Topishmoqlar",
    questions: [
      {
        question: "1. Bir odam yomg'ir ostida 10 daqiqa yurdi. U soyabon ham ishlatmadi, bosh kiyimi ham yo'q edi. Lekin sochi umuman ho'l bo'lmadi. Nega?",
        options: [
          "Yomg'ir juda sekin yog'gan",
          "U yugurib ketgan",
          "U kal bo'lgan",
          "Shamol yomg'irni uchirib ketgan"
        ],
        answer: "U kal bo'lgan"
      },
      {
        question: "2. Qaysi narsa qancha ko'p olinsa, shuncha kattalashib boradi?",
        options: [
          "Pul",
          "Teshik",
          "Sandiq",
          "Yo'l"
        ],
        answer: "Teshik"
      },
      {
        question: "3. Bir xonada 5 ta sham yonib turibdi. 2 tasi o'chirildi. Oxirida nechta sham qoladi?",
        options: [
          "2",
          "3",
          "5",
          "0"
        ],
        answer: "2"
      },
      {
        question: "4. Bir odam 20 qavatli binodan sakrab tushdi va omon qoldi. Qanday qilib?",
        options: [
          "Parashyut bilan",
          "Pastki qavatdan sakragan",
          "Qorga tushgan",
          "Suvga tushgan"
        ],
        answer: "Pastki qavatdan sakragan"
      },
      {
        question: "5. Ota va o'g'il avtohalokatga uchradi. Ota vafot etdi. O'g'ilni kasalxonaga olib borishdi. Jarroh bolani ko'rib: 'Bu mening o'g'lim', dedi. Qanday bo'lishi mumkin?",
        options: [
          "Amakisi",
          "Bobosi",
          "Onasi",
          "Tog'asi"
        ],
        answer: "Onasi"
      },
      {
        question: "6. Bir qo'lda 5 ta olma, ikkinchi qo'lda 6 ta olma bor. Senda nima bor?",
        options: [
          "11 ta olma",
          "Katta qo'llar",
          "Savat",
          "Mevali daraxt"
        ],
        answer: "Katta qo'llar"
      },
      {
        question: "7. Qaysi oyda odamlar eng kam uxlaydi?",
        options: [
          "Fevral",
          "Dekabr",
          "Hech qaysi",
          "Yanvar"
        ],
        answer: "Hech qaysi"
      },
      {
        question: "8. Bir odamning 3 ta qizi bor. Har qizining bittadan ukasi bor. Odamning nechta farzandi bor?",
        options: [
          "4",
          "5",
          "6",
          "7"
        ],
        answer: "4"
      },
      {
        question: "9. Qaysi savolga 'ha' deb ham, 'yo'q' deb ham to'g'ri javob berib bo'lmaydi?",
        options: [
          "Isming nima?",
          "Uxlayapsanmi?",
          "Yoshing nechada?",
          "Qayerda yashaysan?"
        ],
        answer: "Uxlayapsanmi?"
      },
      {
        question: "10. Elektr poyezdi shimolga qarab ketmoqda. Shamol janubga qarab esmoqda. Tutun qaysi tomonga ketadi?",
        options: [
          "Shimolga",
          "Janubga",
          "Sharqqa",
          "Tutun bo'lmaydi"
        ],
        answer: "Tutun bo'lmaydi"
      },
      {
        question: "11. Bir savatdagi 6 ta olmadan 4 tasini olding. Senda nechta olma bor?",
        options: [
          "2",
          "4",
          "6",
          "10"
        ],
        answer: "4"
      },
      {
        question: "12. Bir xonada 10 kishi bor. Har biri boshqalar bilan bir martadan qo'l berib ko'rishdi. Jami nechta qo'l berish bo'ldi?",
        options: [
          "45",
          "50",
          "55",
          "90"
        ],
        answer: "45"
      },
      {
        question: "13. Qaysi narsa sindirilsa ishlatiladi?",
        options: [
          "Shisha",
          "Qalam",
          "Tuxum",
          "Qulf"
        ],
        answer: "Tuxum"
      },
      {
        question: "14. Bir odam juma kuni shaharga keldi. Uch kun qolib, juma kuni qaytib ketdi. Bu qanday mumkin?",
        options: [
          "Kalendar xato",
          "Shahar nomi Juma",
          "U yolg'on gapirgan",
          "Boshqa davlat"
        ],
        answer: "Shahar nomi Juma"
      },
      {
        question: "15. Men gapirsam yo'qolaman. Men nimaman?",
        options: [
          "Tuman",
          "Sir",
          "Sukut",
          "Sham"
        ],
        answer: "Sukut"
      }
    ]
  },

  {
    category: "logic",
    topic: "Ortiqcha elementni toping",
    questions: [
      {
        question: "1. Qaysi biri ortiqcha?",
        options: [
          "Kvadrat",
          "To'rtburchak",
          "Trapetsiya",
          "Uchburchak"
        ],
        answer: "Uchburchak"
      },
      {
        question: "2. Qaysi biri ortiqcha?",
        options: [
          "Mis",
          "Temir",
          "Alyuminiy",
          "Granit"
        ],
        answer: "Granit"
      },
      {
        question: "3. Qaysi biri ortiqcha?",
        options: [
          "Yurak",
          "O'pka",
          "Buyrak",
          "Kompyuter"
        ],
        answer: "Kompyuter"
      },
      {
        question: "4. Qaysi biri ortiqcha?",
        options: [
          "Mars",
          "Yupiter",
          "Oy",
          "Saturn"
        ],
        answer: "Oy"
      },
      {
        question: "5. Qaysi biri ortiqcha?",
        options: [
          "Python",
          "Java",
          "C++",
          "Windows"
        ],
        answer: "Windows"
      },
      {
        question: "6. Qaysi biri ortiqcha?",
        options: [
          "Gitara",
          "Pianino",
          "Skripka",
          "Printer"
        ],
        answer: "Printer"
      },
      {
        question: "7. Qaysi biri ortiqcha?",
        options: [
          "Olma",
          "Nok",
          "Banan",
          "Kartoshka"
        ],
        answer: "Kartoshka"
      },
      {
        question: "8. Qaysi biri ortiqcha?",
        options: [
          "Kilogramm",
          "Gramm",
          "Litr",
          "Tonna"
        ],
        answer: "Litr"
      },
      {
        question: "9. Qaysi biri ortiqcha?",
        options: [
          "Fotosintez",
          "Nafas olish",
          "Ovqat hazm qilish",
          "Wi-Fi"
        ],
        answer: "Wi-Fi"
      },
      {
        question: "10. Qaysi biri ortiqcha?",
        options: [
          "HTML",
          "CSS",
          "JavaScript",
          "Photoshop"
        ],
        answer: "Photoshop"
      },
      {
        question: "11. Qaysi biri ortiqcha?",
        options: [
          "Pingvin",
          "Tuyaqush",
          "Lochin",
          "Ko'rshapalak"
        ],
        answer: "Ko'rshapalak"
      },
      {
        question: "12. Qaysi biri ortiqcha?",
        options: [
          "Sinus",
          "Kosinus",
          "Tangens",
          "Logarifm"
        ],
        answer: "Logarifm"
      },
      {
        question: "13. Qaysi biri ortiqcha?",
        options: [
          "SSD",
          "HDD",
          "RAM",
          "Monitor"
        ],
        answer: "Monitor"
      },
      {
        question: "14. Qaysi biri ortiqcha?",
        options: [
          "London",
          "Parij",
          "Berlin",
          "Bavariya"
        ],
        answer: "Bavariya"
      },
      {
        question: "15. Qaysi biri ortiqcha?",
        options: [
          "Kasr",
          "Natural son",
          "Butun son",
          "Uchburchak"
        ],
        answer: "Uchburchak"
      }
    ]
  },











  {
    category: "iq",
    topic: "Pul va bank tizimi",
    questions: [
      {
        question: "Pulning asosiy vazifasi nima?",
        options: ["Soliq yig'ish", "Ayirboshlash vositasi bo'lish", "Kredit berish", "Narx belgilash"],
        answer: "Ayirboshlash vositasi bo'lish",
      },
      {
        question: "O'zbekistonda milliy valyuta nima?",
        options: ["Rubl", "Dollar", "So'm", "Yevro"],
        answer: "So'm",
      },
      {
        question: "Bankning asosiy vazifasi nima?",
        options: ["Kitob sotish", "Moliyaviy vositachilik qilish", "Soliq yig'ish", "Zavod qurish"],
        answer: "Moliyaviy vositachilik qilish",
      },
      {
        question: "Jamg'arma hisobvarag'i nimaga xizmat qiladi?",
        options: ["Pul saqlash va foiz olishga", "Soliq to'lashga", "Import qilishga", "Sug'urta qilishga"],
        answer: "Pul saqlash va foiz olishga",
      },
      {
        question: "Kredit nima?",
        options: ["Qarzni qaytarish majburiyati bilan olingan mablag'", "Sovg'a", "Soliq", "Dividend"],
        answer: "Qarzni qaytarish majburiyati bilan olingan mablag'",
      },
      {
        question: "Markaziy bankning asosiy vazifasi?",
        options: ["Telefon sotish", "Pul-kredit siyosatini yuritish", "Avtomobil ishlab chiqarish", "Import qilish"],
        answer: "Pul-kredit siyosatini yuritish",
      },
      {
        question: "Inflyatsiya davrida pulning xarid qobiliyati:",
        options: ["Oshadi", "O'zgarmaydi", "Pasayadi", "Ikki baravar oshadi"],
        answer: "Pasayadi",
      },
      {
        question: "Tijorat banklari daromadining asosiy manbai:",
        options: ["Soliq yig'ish", "Kredit foizlari", "Jarimalar", "Eksport"],
        answer: "Kredit foizlari",
      },
      {
        question: "Majburiy rezerv normasi oshirilsa:",
        options: ["Banklar ko'proq kredit beradi", "Kreditlash kamayadi", "Pul massasi oshadi", "Hech narsa o'zgarmaydi"],
        answer: "Kreditlash kamayadi",
      },
      {
        question: "Depozit nima?",
        options: ["Bankka qo'yilgan mablag'", "Soliq turi", "Sug'urta", "Aksiya"],
        answer: "Bankka qo'yilgan mablag'",
      },
      {
        question: "Pul multiplikatori qaysi ko'rsatkich bilan teskari bog'liq?",
        options: ["Foiz stavkasi", "Majburiy rezerv normasi", "YaIM", "Inflyatsiya"],
        answer: "Majburiy rezerv normasi",
      },
      {
        question: "Ochiq bozor operatsiyasida Markaziy bank obligatsiyalarni sotib olsa:",
        options: ["Pul massasi kamayadi", "Pul massasi ortadi", "Soliq ortadi", "Kreditlar yo'qoladi"],
        answer: "Pul massasi ortadi",
      },
      {
        question: "Nominal foiz stavkasi 12%, inflyatsiya 7% bo'lsa, taxminiy real foiz stavkasi:",
        options: ["19%", "12%", "5%", "-5%"],
        answer: "5%",
      },
      {
        question: "Bank tizimida 'likvidlik' nimani anglatadi?",
        options: ["Aktivlarni tezda naqd pulga aylantira olish qobiliyati", "Foyda", "Soliq", "Qarzdorlik"],
        answer: "Aktivlarni tezda naqd pulga aylantira olish qobiliyati",
      },
      {
        question: "Qaysi holat pul-kredit siyosatining qisqaruvchi siyosatiga misol bo'ladi?",
        options: ["Foiz stavkalarini pasaytirish", "Obligatsiyalarni sotib olish", "Rezerv talabini kamaytirish", "Rezerv talabini oshirish"],
        answer: "Rezerv talabini oshirish",
      },
    ],
  },







  {
    category: "iq",
    topic: "Mikroiqtisodiyot asoslari",
    questions: [
      {
        question: "1. Hamma iqtisodiy tizimlar uchun fundamental muammo bo‘lib hisoblanadi, bu...",
        options: [
          "Investitsiya",
          "Ishlab chiqarish",
          "Noyoblik va taqchillik",
          "Iste’mol"
        ],
        answer: "Noyoblik va taqchillik"
      },
      {
        question: "2. Har qanday iqtisodiy tizimlarda 'nima', 'qanday' va 'kim uchun' degan fundamental savollar mikro va makro darajada hal etiladi. Quyidagi savollardan qaysi biri mikroiqtisodiyot darajasida hal etiladi?",
        options: [
          "To‘liq bandlik darajasiga qanday qilib erishiladi?",
          "Nima va qancha ishlab chiqarish kerak?",
          "Inflyatsiyadan qanday qutilish mumkin?",
          "Iqtisodiy o‘sishni qanday rag‘batlantirish mumkin?"
        ],
        answer: "Nima va qancha ishlab chiqarish kerak?"
      },
      {
        question: "3. 'Mikroiqtisodiyot' fani nimani o‘rganadi?",
        options: [
          "Iqtisodiy tizimning harakatini va rivojlanishini yaxlit o‘rganadi",
          "Jamiyat ehtiyojlarini qondirish uchun resurslardan foydalanishni o‘rganadi",
          "Alohida iqtisodiy subyektlar va alohida bozorlarning faoliyatini o‘rganadi",
          "Bozor iqtisodiyotining rivojlanish mexanizmini o‘rganadi"
        ],
        answer: "Alohida iqtisodiy subyektlar va alohida bozorlarning faoliyatini o‘rganadi"
      },
      {
        question: "4. Iqtisodiyotning asosiy muammosi nima?",
        options: [
          "Cheksiz ehtiyojni qondirishda cheklangan resurslardan oqilona foydalanish",
          "Ishlab chiqarishni to‘g‘ri tashkil etish",
          "Ko‘proq foyda olish",
          "Nima ishlab chiqarish kerak"
        ],
        answer: "Cheksiz ehtiyojni qondirishda cheklangan resurslardan oqilona foydalanish"
      },
      {
        question: "5. Agar iqtisodiy muammolarning bir qismi bozor, bir qismi hukumat tomonidan hal etilsa, bunday iqtisodiyot...",
        options: [
          "Aralash",
          "Ma’muriy",
          "Natural",
          "Bozorli"
        ],
        answer: "Aralash"
      },
      {
        question: "6. Agar jamiyatda ishlab chiqarish resurslari ko‘paysa, u holda...",
        options: [
          "Tovar va xizmatlar ishlab chiqarish ko‘payadi",
          "Texnologiya yaxshilanadi",
          "Iqtisodiyot tovar va xizmatlar ishlab chiqarishini ko‘paytirish imkoniga ega bo‘ladi",
          "Farovonlik avtomatik oshadi"
        ],
        answer: "Iqtisodiyot tovar va xizmatlar ishlab chiqarishini ko‘paytirish imkoniga ega bo‘ladi"
      },
      {
        question: "7. Ishlab chiqarish resursi hisoblanmaydigan qatorni belgilang.",
        options: [
          "Foydali qazilmalar",
          "Malakali ishchi kuchi",
          "Iste’mol mollari",
          "Laboratoriya jihozlari"
        ],
        answer: "Iste’mol mollari"
      },
      {
        question: "8. Ishlab chiqarish resurslariga nimalar kiradi?",
        options: [
          "Mehnat, kapital, tadbirkorlik qobiliyati",
          "Mehnat, yer, kapital, tadbirkorlik qobiliyati, axborot",
          "Mehnat, yer, kapital",
          "Faqat yer va kapital"
        ],
        answer: "Mehnat, yer, kapital, tadbirkorlik qobiliyati, axborot"
      },
      {
        question: "9. Iqtisodiy ne’mat tavsiflari qaysilar?",
        options: [
          "Ehtiyojni qondirish vositasi, kamyoblik, qimmatlilik",
          "Faqat kamyoblik",
          "Faqat qimmatlilik",
          "Faqat ehtiyojni qondirish vositasi"
        ],
        answer: "Ehtiyojni qondirish vositasi, kamyoblik, qimmatlilik"
      },
      {
        question: "10. Iqtisodiy agentlar deb nimaga aytiladi?",
        options: [
          "Ishlab chiqaruvchi korxonalar",
          "Iste’molchilar",
          "Iqtisodiy ne’matlarni ishlab chiqarish, taqsimlash, ayirboshlash va iste’mol qilishda qatnashuvchi subyektlar",
          "Uy xo‘jaligi"
        ],
        answer: "Iqtisodiy ne’matlarni ishlab chiqarish, taqsimlash, ayirboshlash va iste’mol qilishda qatnashuvchi subyektlar"
      },
      {
        question: "11. Quyidagilardan qaysi biri mehnatga bo‘lgan talabga ta’sir ko‘rsatmaydi?",
        options: [
          "Inflyatsiya natijasida sodir bo‘lgan nominal ish haqining o‘zgarishi",
          "Ishlab chiqarish texnologiyasi",
          "Yakuniy mahsulotga bo‘lgan talab",
          "Mehnatning chekli mahsuloti bilan boshqa resurslarning chekli mahsuloti o‘rtasidagi munosabat"
        ],
        answer: "Inflyatsiya natijasida sodir bo‘lgan nominal ish haqining o‘zgarishi"
      },
      {
        question: "12. Qaysi ibora insonlarning biror bir tovarni sotib olish uchun imkoniyat va xohishi borligini anglatadi?",
        options: [
          "Talab",
          "Ehtiyoj",
          "Zaruriyat",
          "Xohish"
        ],
        answer: "Talab"
      },
      {
        question: "13. Talab qonuni deyiladi, agar...",
        options: [
          "Daromad oshsa, xarid ham oshadi",
          "Talab egri chizig‘i musbat qiyalikka ega",
          "Mahsulot narxi pasaysa, xarid hajmi ortadi",
          "Taklif talabdan oshsa narx tushadi"
        ],
        answer: "Mahsulot narxi pasaysa, xarid hajmi ortadi"
      },
      {
        question: "14. X mahsulotga bo‘lgan talab chizig‘i siljishini nima bilan izohlash mumkin?",
        options: [
          "Iste’molchilar didlarining o‘zgarganligi sababli har qanday narxda ko‘proq xarid qilishni xohlashadi",
          "Mahsulot narxi o‘zgargani uchun kamroq xarid qilishadi",
          "Mahsulot taklifi kamaygan",
          "Narx pasaygani uchun ko‘proq xarid qilishadi"
        ],
        answer: "Iste’molchilar didlarining o‘zgarganligi sababli har qanday narxda ko‘proq xarid qilishni xohlashadi"
      },
      {
        question: "15. Ishlab chiqaruvchi X mahsulot narxini 5% ga pasaytirdi, natijada sotuv hajmi 4% ga oshdi. X mahsulotga bo‘lgan talab qanday?",
        options: [
          "Elastik",
          "Noelastik",
          "Mutlaq elastik",
          "Birlik elastik"
        ],
        answer: "Noelastik"
      }
    ]
  },











  {
    category: "iq",
    topic: "Makroiqtisodiyot asoslari",
    questions: [
      {
        question: "1. Mikroiqtisodiyotdan farqli ravishda makroiqtisodiyot...",
        options: [
          "Ustuvor ravishda umumlashtirilgan tushunchalar bilan ishlaydi",
          "Tavakkal fikrlarni qo‘llamaydi",
          "Uy xo‘jaliklari hulq-atvorini o‘rganadi",
          "Iqtisodiy muvozanat tushunchasidan foydalanadi"
        ],
        answer: "Ustuvor ravishda umumlashtirilgan tushunchalar bilan ishlaydi"
      },
      {
        question: "2. Milliy daromad tarkibiga nimalar kiradi?",
        options: [
          "Ijara haqi, ish haqi, kapitalga foiz, mulkdan olingan daromad va korporatsiya foydasi",
          "Investitsiyalar – jamg‘armalar",
          "Uzoq muddat foydalaniladigan buyumlar va xizmatlar qiymati",
          "Uy xo‘jaliklari + investitsiya + davlat xarajatlari – transfert to‘lovlari + bilvosita soliqlar"
        ],
        answer: "Ijara haqi, ish haqi, kapitalga foiz, mulkdan olingan daromad va korporatsiya foydasi"
      },
      {
        question: "3. Milliy daromad va biznesga egri soliqlar yig‘indisi – bu...",
        options: [
          "Sof ichki mahsulot",
          "Shaxsiy daromad",
          "Yalpi ichki mahsulot",
          "Ixtiyordagi daromad"
        ],
        answer: "Sof ichki mahsulot"
      },
      {
        question: "4. Milliy iqtisodiyot holatini xarakterlovchi muhim makroiqtisodiy ko‘rsatkichlar – bu...",
        options: [
          "Yalpi milliy daromad, yalpi ichki mahsulot, sof milliy mahsulot, milliy daromad, ishchi kuchi bandligi, ishsizlik, inflyatsiya",
          "Yalpi milliy daromad, yalpi ichki mahsulot",
          "Yalpi milliy daromad, to‘lov balansi, sof milliy mahsulot, milliy daromad",
          "Daromad, ichki milliy mahsulot"
        ],
        answer: "Yalpi milliy daromad, yalpi ichki mahsulot, sof milliy mahsulot, milliy daromad, ishchi kuchi bandligi, ishsizlik, inflyatsiya"
      },
      {
        question: "5. Monetaristlar iqtisodiyotni barqarorlashtirishning eng maqbul vositasi deb nimani hisoblaydilar?",
        options: [
          "Pul massasi o‘zgarishini",
          "Soliqlar o‘zgarishini",
          "Davlat xarajatlari o‘zgarishini",
          "Davlat zaxiralari o‘zgarishini"
        ],
        answer: "Pul massasi o‘zgarishini"
      },
      {
        question: "6. Mutlaq ustunlik nazariyasi qaysi olimga tegishli?",
        options: [
          "A. Smit",
          "D. Rikardo",
          "E. Xeksher",
          "B. Olin"
        ],
        answer: "A. Smit"
      },
      {
        question: "7. Narxlar indeksi qanday farqni baholash uchun ishlatiladi?",
        options: [
          "Turli davrdagi iste'mol savatining bozor qiymatidagi farqini baholash uchun",
          "Ikki turli mamlakat narx darajalaridagi farqni baholash uchun",
          "Bazis yildagi ishlab chiqarish tarkibidagi farqni baholash uchun",
          "Ulgurji va chakana narx darajalari o‘rtasidagi farqni baholash uchun"
        ],
        answer: "Turli davrdagi iste'mol savatining bozor qiymatidagi farqini baholash uchun"
      },
      {
        question: "8. Nima uchun oraliq va pirovard mahsulotlarni farqlay bilishimiz kerak?",
        options: [
          "Bir mahsulotni ikki marta hisoblamaslik uchun",
          "Bir mahsulotni ikki joyda hisoblash uchun",
          "Bir mahsulotni ikki joyda iste'mol qilish uchun",
          "Ikki mahsulotni iste'mol qilish uchun"
        ],
        answer: "Bir mahsulotni ikki marta hisoblamaslik uchun"
      },
      {
        question: "9. Nisbiy ustunlik nazariyasi kimga tegishli?",
        options: [
          "D. Rikardo",
          "Abba Lerner",
          "J. Keyns",
          "J. Xiks"
        ],
        answer: "D. Rikardo"
      },
      {
        question: "10. Nominal YaIM qanday narxlarda hisoblanadi?",
        options: [
          "Joriy narxlarda",
          "O‘zgaruvchan narxlarda",
          "Chakana narxlarda",
          "Ulgurji narxlarda"
        ],
        answer: "Joriy narxlarda"
      },
      {
        question: "11. Ochiq iqtisodiyot – bu...",
        options: [
          "Mamlakatning fuqarolari xalqaro bozorda cheklanmagan miqdorda faoliyat yuritish huquqiga ega",
          "Xalqaro investitsiya qisman kirib kelishi mumkin",
          "Mamlakat aholisi cheklangan holdagi faoliyati",
          "Tashqi iqtisodiy aloqalarning qisman cheklangan shakli"
        ],
        answer: "Mamlakatning fuqarolari xalqaro bozorda cheklanmagan miqdorda faoliyat yuritish huquqiga ega"
      },
      {
        question: "12. Pirovard mahsulot – bu...",
        options: [
          "Yakuniy iste'mol uchun sotib olinadigan tugal mahsulot",
          "Qayta ishlash uchun sotib olinadigan tugal mahsulot",
          "Sotish va qayta ishlash uchun sotib olinadigan tugal mahsulot",
          "Sotish uchun sotib olinadigan tugal mahsulot"
        ],
        answer: "Yakuniy iste'mol uchun sotib olinadigan tugal mahsulot"
      },
      {
        question: "13. Potensial YaIM deganda...",
        options: [
          "Mamlakatdagi ishlab chiqarish resurslaridan to‘liq foydalanilgan sharoitda mumkin bo‘lgan ishlab chiqarish hajmi tushuniladi",
          "Juda ko‘p hajmda ishlab chiqarilgan mahsulot",
          "Resurslarni tejab ishlatish natijasidagi ishlab chiqarilgan mahsulot hajmi",
          "YaIMning kamayib ketishi"
        ],
        answer: "Mamlakatdagi ishlab chiqarish resurslaridan to‘liq foydalanilgan sharoitda mumkin bo‘lgan ishlab chiqarish hajmi tushuniladi"
      },
      {
        question: "14. Pulning qadr-qimmati nima bilan o‘lchanadi?",
        options: [
          "Iqtisodiyotdagi muomalada bo‘lgan pul miqdori bilan",
          "Mamlakatning oltin zaxirasi bilan",
          "Mutloq likvidliligi bilan",
          "Undagi oltin miqdori va narxlar darajasi bilan"
        ],
        answer: "Undagi oltin miqdori va narxlar darajasi bilan"
      },
      {
        question: "15. Qanday mamlakat iqtisodiyoti ochiq iqtisodiyot deyiladi?",
        options: [
          "Eksport-import aloqalari yo‘lga qo‘yilgan",
          "Eksport-import aloqalari yo‘lga qo‘yilmagan",
          "Faqat import aloqalari yo‘lga qo‘yilgan",
          "Faqat eksport aloqalari yo‘lga qo‘yilgan"
        ],
        answer: "Eksport-import aloqalari yo‘lga qo‘yilgan"
      }
    ]
  },







  {
    category: "iq",
    topic: "Talab va taklif qonunlari",
    questions: [
      {
        question: "1. Talab nima?",
        options: [
          "Ishlab chiqaruvchilarning mahsulot sotish istagi",
          "Iste’molchilarning ma’lum narxda ma’lum miqdorda tovar sotib olish istagi va imkoniyati",
          "Davlatning narxlarni belgilashi",
          "Tovarlar sonining kamayishi"
        ],
        answer: "Iste’molchilarning ma’lum narxda ma’lum miqdorda tovar sotib olish istagi va imkoniyati"
      },
      {
        question: "2. Taklif nima?",
        options: [
          "Iste’molchilarning xarid qilish istagi",
          "Bozor muvozanati",
          "Ishlab chiqaruvchilarning ma’lum narxda tovarni bozorga chiqarish istagi",
          "Narxlarning pasayishi"
        ],
        answer: "Ishlab chiqaruvchilarning ma’lum narxda tovarni bozorga chiqarish istagi"
      },
      {
        question: "3. Talab qonuni nima?",
        options: [
          "Narx oshsa talab oshadi",
          "Narx va talab bir xil o‘zgaradi",
          "Narx oshsa talab kamayadi, narx tushsa talab oshadi",
          "Talab narxga bog‘liq emas"
        ],
        answer: "Narx oshsa talab kamayadi, narx tushsa talab oshadi"
      },
      {
        question: "4. Taklif qonuni nima?",
        options: [
          "Narx oshsa taklif oshadi, narx tushsa taklif kamayadi",
          "Narx oshsa taklif kamayadi",
          "Taklif narxga bog‘liq emas",
          "Narx tushsa taklif oshadi"
        ],
        answer: "Narx oshsa taklif oshadi, narx tushsa taklif kamayadi"
      },
      {
        question: "5. Talabga ta’sir etuvchi omillar qaysilar?",
        options: [
          "Faqat narx",
          "Faqat daromad",
          "Daromad, narx, did, aholi soni, o‘rinbosar tovarlar",
          "Faqat reklama"
        ],
        answer: "Daromad, narx, did, aholi soni, o‘rinbosar tovarlar"
      },
      {
        question: "6. Taklifga ta’sir etuvchi omillar qaysilar?",
        options: [
          "Ishlab chiqarish xarajatlari, texnologiya, soliqlar",
          "Faqat narx",
          "Faqat daromad",
          "Aholi soni"
        ],
        answer: "Ishlab chiqarish xarajatlari, texnologiya, soliqlar"
      },
      {
        question: "7. Bozor muvozanati nima?",
        options: [
          "Talab taklifdan ko‘p bo‘lgan holat",
          "Taklif talabdan ko‘p bo‘lgan holat",
          "Talab va taklif teng bo‘lgan holat",
          "Narxlarning oshishi"
        ],
        answer: "Talab va taklif teng bo‘lgan holat"
      },
      {
        question: "8. Muvozanat narxi nima?",
        options: [
          "Eng yuqori narx",
          "Eng past narx",
          "Davlat belgilagan narx",
          "Talab va taklif tenglashgan narx"
        ],
        answer: "Talab va taklif tenglashgan narx"
      },
      {
        question: "9. Talab elastikligi nima?",
        options: [
          "Narx o‘zgarishiga talabning sezgirligi",
          "Taklifning o‘zgarishi",
          "Narxning oshishi",
          "Bozor muvozanati"
        ],
        answer: "Narx o‘zgarishiga talabning sezgirligi"
      },
      {
        question: "10. Taklif elastikligi nima?",
        options: [
          "Talabning o‘zgarishi",
          "Narx o‘zgarishiga taklifning sezgirligi",
          "Narxning pasayishi",
          "Ishlab chiqarish hajmi"
        ],
        answer: "Narx o‘zgarishiga taklifning sezgirligi"
      },
      {
        question: "11. Elastik talab degani?",
        options: [
          "Narx o‘zgarishiga umuman javob bermaydigan talab",
          "Narx o‘zgarishiga sust javob beruvchi talab",
          "Narx o‘zgarishiga kuchli javob beruvchi talab",
          "Taklifning o‘zgarishi"
        ],
        answer: "Narx o‘zgarishiga kuchli javob beruvchi talab"
      },
      {
        question: "12. Noelastik talab degani?",
        options: [
          "Narx o‘zgarishiga kuchli javob beruvchi talab",
          "Narx o‘zgarishiga sust javob beruvchi talab",
          "Taklifning o‘zgarishi",
          "Bozor muvozanati"
        ],
        answer: "Narx o‘zgarishiga sust javob beruvchi talab"
      },
      {
        question: "13. Talab egri chizig‘i qayerga og‘adi?",
        options: [
          "Chapdan pastga o‘ngga qarab",
          "Chapdan yuqoriga o‘ngga qarab",
          "Tik holatda",
          "Gorizontal holatda"
        ],
        answer: "Chapdan pastga o‘ngga qarab"
      },
      {
        question: "14. Taklif egri chizig‘i qayerga og‘adi?",
        options: [
          "Chapdan pastga o‘ngga qarab",
          "Tik holatda",
          "Chapdan yuqoriga o‘ngga qarab",
          "Gorizontal holatda"
        ],
        answer: "Chapdan yuqoriga o‘ngga qarab"
      },
      {
        question: "15. Talab ortishi nimani anglatadi?",
        options: [
          "Iste’molchilar kamroq xarid qiladi",
          "Ishlab chiqaruvchilar mahsulotni kamaytiradi",
          "Narxlar pasayadi",
          "Iste’molchilar ko‘proq sotib olishni xohlaydi"
        ],
        answer: "Iste’molchilar ko‘proq sotib olishni xohlaydi"
      }
    ]
  },















  {
    category: "iq",
    topic: "Inflyatsiya va ishsizlik",
    questions: [
      {
        question: "Inflyatsiya nima?",
        options: ["Ishsizlikning kamayishi", "Narxlar umumiy darajasining oshishi", "Ish haqining oshishi", "Soliqlarning kamayishi"],
        answer: "Narxlar umumiy darajasining oshishi",
      },
      {
        question: "Qaysi holat inflyatsiyaga misol bo'ladi?",
        options: ["Non narxi 3000 so'mdan 3300 so'mga chiqdi", "Ishsizlik kamaydi", "Dollar kursi o'zgarmadi", "Bank ochildi"],
        answer: "Non narxi 3000 so'mdan 3300 so'mga chiqdi",
      },
      {
        question: "Ishsizlik nima?",
        options: ["Daromadning kamayishi", "Ishlashni xohlaydigan, lekin ish topa olmayotgan odamlar holati", "Talabalarning o'qishi", "Pensionerlar soni"],
        answer: "Ishlashni xohlaydigan, lekin ish topa olmayotgan odamlar holati",
      },
      {
        question: "Inflyatsiya davrida pulning xarid qobiliyati:",
        options: ["Oshadi", "O'zgarmaydi", "Pasayadi", "Ikki baravar oshadi"],
        answer: "Pasayadi",
      },
      {
        question: "Qaysi tashkilot inflyatsiyani nazorat qilishda muhim rol o'ynaydi?",
        options: ["Maktab", "Markaziy bank", "Universitet", "Kasaba uyushmasi"],
        answer: "Markaziy bank",
      },
      {
        question: "Agar inflyatsiya 10% bo'lsa, 100 000 so'mning xarid qobiliyati:",
        options: ["Oshadi", "Taxminan kamayadi", "O'zgarmaydi", "Nolga teng bo'ladi"],
        answer: "Taxminan kamayadi",
      },
      {
        question: "Qaysi holat talab inflyatsiyasiga sabab bo'lishi mumkin?",
        options: ["Ishlab chiqarish xarajatlari oshishi", "Aholining xaridlari keskin ortishi", "Hosilning kamayishi", "Soliq oshishi"],
        answer: "Aholining xaridlari keskin ortishi",
      },
      {
        question: "Ishsizlikning qaysi turi yangi ish qidirayotgan odamlar bilan bog'liq?",
        options: ["Friksion", "Strukturaviy", "Tsiklik", "Yashirin"],
        answer: "Friksion",
      },
      {
        question: "Strukturaviy ishsizlik odatda nima sababli yuzaga keladi?",
        options: ["Texnologik o'zgarishlar", "Dam olish mavsumi", "Narxlar tushishi", "Soliq kamayishi"],
        answer: "Texnologik o'zgarishlar",
      },
      {
        question: "Qaysi ko'rsatkich mamlakatdagi ishsizlik darajasini ifodalaydi?",
        options: ["YaIM", "Ishsizlar sonining mehnat resurslariga nisbati", "Eksport hajmi", "Inflyatsiya darajasi"],
        answer: "Ishsizlar sonining mehnat resurslariga nisbati",
      },
      {
        question: "Agar nominal ish haqi 15% ga oshsa, lekin inflyatsiya 20% bo'lsa:",
        options: ["Real ish haqi oshadi", "Real ish haqi kamayadi", "Hech narsa o'zgarmaydi", "Real ish haqi ikki baravar oshadi"],
        answer: "Real ish haqi kamayadi",
      },
      {
        question: "Phillips egri chizig'i nimani ko'rsatadi?",
        options: ["Soliq va YaIM bog'liqligini", "Inflyatsiya va ishsizlik o'rtasidagi bog'liqlikni", "Eksport va import nisbatini", "Foiz va investitsiyalar nisbatini"],
        answer: "Inflyatsiya va ishsizlik o'rtasidagi bog'liqlikni",
      },
      {
        question: "Qaysi holat \"cost-push inflation\" ga misol bo'ladi?",
        options: ["Aholi xarajatlarining oshishi", "Neft narxining keskin qimmatlashishi", "Soliqlarning kamayishi", "Kreditlarning ko'payishi"],
        answer: "Neft narxining keskin qimmatlashishi",
      },
      {
        question: "Tsiklik ishsizlik odatda qachon yuz beradi?",
        options: ["Iqtisodiy pasayish davrida", "Texnologik rivojlanish vaqtida", "Universitet bitirganda", "Mavsumiy ishlarda"],
        answer: "Iqtisodiy pasayish davrida",
      },
      {
        question: "Tabiiy ishsizlik darajasi tarkibiga odatda qaysi ishsizliklar kiradi?",
        options: ["Tsiklik va yashirin", "Friksion va strukturaviy", "Tsiklik va strukturaviy", "Mavsumiy va tsiklik"],
        answer: "Friksion va strukturaviy",
      },
    ],
  },








  {
    category: "iq",
    topic: "Davlat byudjeti va soliq tizimi",
    questions: [
      {
        question: "Davlat byudjeti nima?",
        options: ["Korxona moliyaviy rejasi", "Davlatning daromad va xarajatlar rejasi", "Bank hisoboti", "Oila budjeti"],
        answer: "Davlatning daromad va xarajatlar rejasi",
      },
      {
        question: "Davlat byudjetining asosiy daromad manbai nima?",
        options: ["Jarimalar", "Soliqlar", "Kreditlar", "Dividendlar"],
        answer: "Soliqlar",
      },
      {
        question: "Soliq nima?",
        options: ["Davlatga majburiy to'lov", "Kredit turi", "Jamg'arma", "Investitsiya"],
        answer: "Davlatga majburiy to'lov",
      },
      {
        question: "Qo'shilgan qiymat solig'i (QQS) qaysi turdagi soliq?",
        options: ["Bevosita", "Bilvosita", "Mahalliy", "Xalqaro"],
        answer: "Bilvosita",
      },
      {
        question: "Davlat byudjeti mablag'lari qaysi sohaga sarflanishi mumkin?",
        options: ["Ta'lim", "Sog'liqni saqlash", "Mudofaa", "Yuqoridagilarning barchasi"],
        answer: "Yuqoridagilarning barchasi",
      },
      {
        question: "Agar davlat xarajatlari daromadlaridan oshib ketsa, nima yuzaga keladi?",
        options: ["Profitsit", "Defitsit", "Depozit", "Inflyatsiya"],
        answer: "Defitsit",
      },
      {
        question: "Byudjet profitsiti nima?",
        options: ["Xarajatlar daromadlardan ko'p", "Daromadlar xarajatlardan ko'p", "Soliqlar bekor qilingan", "Kreditlar ko'paygan"],
        answer: "Daromadlar xarajatlardan ko'p",
      },
      {
        question: "Jismoniy shaxs daromad solig'i qaysi turga kiradi?",
        options: ["Bevosita soliq", "Bilvosita soliq", "Aksiz solig'i", "Bojxona to'lovi"],
        answer: "Bevosita soliq",
      },
      {
        question: "Davlat defitsitni qoplash uchun ko'pincha nima qiladi?",
        options: ["Obligatsiyalar chiqaradi", "Maktablar quradi", "Eksportni to'xtatadi", "Soliqlarni bekor qiladi"],
        answer: "Obligatsiyalar chiqaradi",
      },
      {
        question: "Aksiz solig'i odatda qaysi mahsulotlarga qo'llaniladi?",
        options: ["Non va sut", "Tamaki va alkogol", "Kitoblar", "Dori vositalari"],
        answer: "Tamaki va alkogol",
      },
      {
        question: "Qaysi holatda progressiv soliq tizimi qo'llaniladi?",
        options: ["Daromad oshgani sari soliq stavkasi kamayadi", "Hamma bir xil foiz to'laydi", "Daromad oshgani sari soliq stavkasi ham oshadi", "Soliq faqat korxonalardan olinadi"],
        answer: "Daromad oshgani sari soliq stavkasi ham oshadi",
      },
      {
        question: "Agar hukumat iqtisodiyotni rag'batlantirmoqchi bo'lsa, qaysi fiskal siyosatni qo'llashi mumkin?",
        options: ["Xarajatlarni kamaytirish", "Soliqlarni oshirish", "Xarajatlarni oshirish", "Pul massasini kamaytirish"],
        answer: "Xarajatlarni oshirish",
      },
      {
        question: "Davlat qarzi ortib borishi uzoq muddatda nimaga olib kelishi mumkin?",
        options: ["Foiz to'lovlarining oshishiga", "Soliqlarning yo'qolishiga", "Ishsizlikning nol bo'lishiga", "Pulning qadrsizlanmasligiga"],
        answer: "Foiz to'lovlarining oshishiga",
      },
      {
        question: "Qaysi soliq iste'molchi tomonidan mahsulot narxi orqali to'lanadi?",
        options: ["Daromad solig'i", "Foyda solig'i", "QQS", "Yer solig'i"],
        answer: "QQS",
      },
      {
        question: "Fiskal siyosat kim tomonidan amalga oshiriladi?",
        options: ["Markaziy bank", "Hukumat va Moliya vazirligi", "Tijorat banklari", "Fond birjasi"],
        answer: "Hukumat va Moliya vazirligi",
      },
    ],
  },











  {
    category: "iq",
    topic: "Xalqaro iqtisodiy munosabatlar",
    questions: [
      {
        question: "Xalqaro savdo nima?",
        options: ["Bir mamlakat ichidagi savdo", "Mamlakatlar o'rtasidagi savdo", "Bank operatsiyasi", "Soliq tizimi"],
        answer: "Mamlakatlar o'rtasidagi savdo",
      },
      {
        question: "Eksport nima?",
        options: ["Tovarlarni chetdan olib kirish", "Tovarlarni boshqa mamlakatlarga sotish", "Soliq yig'ish", "Valyuta almashtirish"],
        answer: "Tovarlarni boshqa mamlakatlarga sotish",
      },
      {
        question: "Import nima?",
        options: ["Tovarlarni xorijga sotish", "Tovarlarni xorijdan sotib olish", "Kredit olish", "Investitsiya kiritish"],
        answer: "Tovarlarni xorijdan sotib olish",
      },
      {
        question: "O'zbekistonning milliy valyutasi qaysi?",
        options: ["Dollar", "Rubl", "So'm", "Yevro"],
        answer: "So'm",
      },
      {
        question: "Valyuta kursi nima?",
        options: ["Soliq stavkasi", "Bir valyutaning boshqa valyutaga nisbatan qiymati", "Kredit foizi", "Inflyatsiya darajasi"],
        answer: "Bir valyutaning boshqa valyutaga nisbatan qiymati",
      },
      {
        question: "Agar eksport importdan ko'p bo'lsa, nima yuz beradi?",
        options: ["Savdo defitsiti", "Savdo profitsiti", "Inflyatsiya", "Ishsizlik"],
        answer: "Savdo profitsiti",
      },
      {
        question: "Quyidagilardan qaysi biri xalqaro tashkilot hisoblanadi?",
        options: ["Mahalla", "IMF", "Maktab", "Bankomat"],
        answer: "IMF",
      },
      {
        question: "Tarif nima?",
        options: ["Eksport subsidiyasi", "Import qilinadigan mahsulotlarga qo'yiladigan boj", "Valyuta kursi", "Kredit foizi"],
        answer: "Import qilinadigan mahsulotlarga qo'yiladigan boj",
      },
      {
        question: "Xorijiy investitsiya nima?",
        options: ["Mamlakat ichidagi jamg'arma", "Boshqa davlatdan kiritilgan kapital", "Soliq turi", "Kredit"],
        answer: "Boshqa davlatdan kiritilgan kapital",
      },
      {
        question: "Valyuta qadrsizlansa (depreciation), eksport odatda:",
        options: ["Qimmatlashadi", "Arzonlashadi va raqobatbardosh bo'ladi", "To'xtaydi", "O'zgarmaydi"],
        answer: "Arzonlashadi va raqobatbardosh bo'ladi",
      },
      {
        question: "Qaysi tashkilot davlatlarga moliyaviy yordam va iqtisodiy maslahatlar beradi?",
        options: ["FIFA", "IMF", "UNESCO", "OPEC"],
        answer: "IMF",
      },
      {
        question: "Mutlaq ustunlik (Absolute Advantage) nimani anglatadi?",
        options: ["Mahsulotni boshqalarga qaraganda kamroq xarajat bilan ishlab chiqarish", "Ko'proq ishchi ishlatish", "Ko'proq eksport qilish", "Yuqori soliq qo'yish"],
        answer: "Mahsulotni boshqalarga qaraganda kamroq xarajat bilan ishlab chiqarish",
      },
      {
        question: "Qiyosiy ustunlik (Comparative Advantage) nazariyasiga ko'ra:",
        options: ["Har bir mamlakat hamma narsani o'zi ishlab chiqarishi kerak", "Mamlakatlar nisbatan samarali ishlab chiqaradigan mahsulotlarga ixtisoslashishi kerak", "Import taqiqlanishi kerak", "Eksport zararli"],
        answer: "Mamlakatlar nisbatan samarali ishlab chiqaradigan mahsulotlarga ixtisoslashishi kerak",
      },
      {
        question: "Agar dollar kursi 10% ga oshsa, import qilinadigan mahsulotlar odatda:",
        options: ["Arzonlashadi", "Qimmatlashadi", "Yo'qoladi", "Soliqsiz bo'ladi"],
        answer: "Qimmatlashadi",
      },
      {
        question: "Savdo balansi nimani ko'rsatadi?",
        options: ["Davlat byudjetini", "Eksport va import o'rtasidagi farqni", "Inflyatsiya darajasini", "Ishsizlik darajasini"],
        answer: "Eksport va import o'rtasidagi farqni",
      },
    ],
  },









  {
    category: "iq",
    topic: "Iqtisodiy o‘sish va rivojlanish",
    questions: [
      {
        question: "Iqtisodiy o‘sish nima?",
        options: ["Narxlarning oshishi", "Mamlakat ishlab chiqarishi hajmining ortishi", "Soliqlarning kamayishi", "Importning oshishi"],
        answer: "Mamlakat ishlab chiqarishi hajmining ortishi",
      },
      {
        question: "Iqtisodiy o‘sishni o‘lchashda eng ko‘p ishlatiladigan ko‘rsatkich qaysi?",
        options: ["Inflyatsiya", "YaIM (GDP)", "Ishsizlik", "Eksport"],
        answer: "YaIM (GDP)",
      },
      {
        question: "YaIM (GDP) nimani bildiradi?",
        options: ["Davlat qarzini", "Mamlakatda ma'lum davrda ishlab chiqarilgan barcha yakuniy mahsulot va xizmatlar qiymatini", "Soliq tushumlarini", "Valyuta zaxiralarini"],
        answer: "Mamlakatda ma'lum davrda ishlab chiqarilgan barcha yakuniy mahsulot va xizmatlar qiymatini",
      },
      {
        question: "Quyidagilardan qaysi biri iqtisodiy rivojlanishga misol?",
        options: ["Maktablar sonining ko‘payishi", "Aholi savodxonligining oshishi", "Tibbiyot xizmatlarining yaxshilanishi", "Yuqoridagilarning barchasi"],
        answer: "Yuqoridagilarning barchasi",
      },
      {
        question: "Qaysi omil iqtisodiy o‘sishga yordam beradi?",
        options: ["Investitsiyalar", "Urushlar", "Ishsizlikning ortishi", "Korruptsiyaning kuchayishi"],
        answer: "Investitsiyalar",
      },
      {
        question: "Aholi soni YaIMdan tezroq o‘ssa, aholi jon boshiga YaIM:",
        options: ["Oshadi", "Kamayadi", "O‘zgarmaydi", "Ikki baravar oshadi"],
        answer: "Kamayadi",
      },
      {
        question: "Inson kapitali nima?",
        options: ["Zavodlar", "Pul mablag'lari", "Bilim, malaka va tajriba", "Soliqlar"],
        answer: "Bilim, malaka va tajriba",
      },
      {
        question: "Qaysi ko‘rsatkich iqtisodiy rivojlanishni baholashda ishlatiladi?",
        options: ["HDI (Human Development Index)", "Dollar kursi", "QQS", "Kredit foizi"],
        answer: "HDI (Human Development Index)",
      },
      {
        question: "Texnologik taraqqiyot odatda:",
        options: ["Mehnat unumdorligini oshiradi", "YaIMni kamaytiradi", "Soliqlarni bekor qiladi", "Ishlab chiqarishni to‘xtatadi"],
        answer: "Mehnat unumdorligini oshiradi",
      },
      {
        question: "Kapital qo‘yilmalarining ortishi nimaga olib kelishi mumkin?",
        options: ["Ishlab chiqarish hajmining ortishiga", "Eksportning yo‘qolishiga", "Ishsizlikning oshishiga", "Soliqlarning bekor bo‘lishiga"],
        answer: "Ishlab chiqarish hajmining ortishiga",
      },
      {
        question: "Quyidagilardan qaysi biri intensiv iqtisodiy o‘sishga misol?",
        options: ["Ko‘proq ishchi yollash", "Ko‘proq yer ishlatish", "Yangi texnologiyalar joriy etish", "Ish vaqtini uzaytirish"],
        answer: "Yangi texnologiyalar joriy etish",
      },
      {
        question: "Agar mamlakat YaIMi 500 mlrd dollardan 550 mlrd dollarga oshsa, iqtisodiy o‘sish sur'ati taxminan necha foiz?",
        options: ["5%", "10%", "15%", "20%"],
        answer: "10%",
      },
      {
        question: "Qaysi holat iqtisodiy rivojlanishni iqtisodiy o‘sishdan farqlaydi?",
        options: ["Faqat ishlab chiqarish hajmi", "Faqat eksport", "Hayot sifati va ijtimoiy ko‘rsatkichlarning yaxshilanishi", "Faqat soliqlar"],
        answer: "Hayot sifati va ijtimoiy ko‘rsatkichlarning yaxshilanishi",
      },
      {
        question: "\"Middle Income Trap\" (o‘rta daromad tuzog‘i) nimani anglatadi?",
        options: ["Mamlakatning yuqori daromadli davlatga aylana olmasligi", "Soliqlarning oshishi", "Inflyatsiyaning pasayishi", "Eksportning ortishi"],
        answer: "Mamlakatning yuqori daromadli davlatga aylana olmasligi",
      },
      {
        question: "Quyidagilardan qaysi biri uzoq muddatli iqtisodiy o‘sishning eng muhim omillaridan biri hisoblanadi?",
        options: ["Tabiiy resurslar", "Ta'lim va innovatsiyalar", "Valyuta kursi", "Bojxona to‘lovlari"],
        answer: "Ta'lim va innovatsiyalar",
      },
    ],
  },


  {
    category: "iq",
    topic: "Iqtisodiyot nazariyasi asoslari",
    premium: true,
    questions: [
      {
        question: "Iqtisodiyotning bosh masalasi nimadan iborat?",
        options: ["Soliqlarni kamaytirish", "Ishsizlikni tugatish", "Cheksiz ehtiyojlar va cheklangan resurslar o‘rtasidagi ziddiyatni hal qilish", "Narxlarni nazorat qilish"],
        answer: "Cheksiz ehtiyojlar va cheklangan resurslar o‘rtasidagi ziddiyatni hal qilish",
      },
      {
        question: "Mikroiqtisodiyot nimani o‘rganadi?",
        options: ["Butun mamlakat iqtisodiyotini", "Korxona, firma va uy xo‘jaliklari faoliyatini", "Xalqaro savdoni", "Davlat byudjetini"],
        answer: "Korxona, firma va uy xo‘jaliklari faoliyatini",
      },
      {
        question: "Iqtisodiy resurslarning asosiy xususiyati nima?",
        options: ["Cheksizligi", "Tez tiklanishi", "Kamyobligi", "Bepulligi"],
        answer: "Kamyobligi",
      },
      {
        question: "Merkantilizm ta’limotiga ko‘ra boylik manbai nima?",
        options: ["Qishloq xo‘jaligi", "Sanoat", "Tashqi savdo", "Xizmatlar sohasi"],
        answer: "Tashqi savdo",
      },
      {
        question: "Fiziokratlar boylikning asosiy manbai deb nimani hisoblashgan?",
        options: ["Savdo", "Qishloq xo‘jaligi", "Bank tizimi", "Sanoat"],
        answer: "Qishloq xo‘jaligi",
      },
      {
        question: "Klassik siyosiy iqtisod maktabining asosiy o‘rganish sohasi qaysi?",
        options: ["Ayirboshlash sohasi", "Moliya bozori", "Ishlab chiqarish sohasi", "Soliq tizimi"],
        answer: "Ishlab chiqarish sohasi",
      },
      {
        question: "Marjinalizm qaysi iqtisodiy miqdorlarni o‘rganishga asoslanadi?",
        options: ["O‘rtacha miqdorlarni", "Keyingi qo‘shilgan miqdorlarni", "Umumiy miqdorlarni", "Minimal miqdorlarni"],
        answer: "Keyingi qo‘shilgan miqdorlarni",
      },
      {
        question: "Iqtisodiy qonunlar qanday xarakterga ega?",
        options: ["Faqat subyektiv", "Faqat huquqiy", "Faqat siyosiy", "Obyektiv"],
        answer: "Obyektiv",
      },
      {
        question: "Takror ishlab chiqarish nima?",
        options: ["Mahsulotlarni eksport qilish", "Ishlab chiqarish jarayonining qayta va uzluksiz takrorlanishi", "Narxlarning oshishi", "Daromadlarni taqsimlash"],
        answer: "Ishlab chiqarish jarayonining qayta va uzluksiz takrorlanishi",
      },
      {
        question: "Oddiy takror ishlab chiqarish nimani anglatadi?",
        options: ["Ishlab chiqarish hajmi o‘zgarmasdan takrorlanishini", "Ishlab chiqarish hajmi ortishini", "Ishlab chiqarish hajmi kamayishini", "Ishsizlikning kamayishini"],
        answer: "Ishlab chiqarish hajmi o‘zgarmasdan takrorlanishini",
      },
      {
        question: "“Siyosiy iqtisod” tushunchasini muallifi kim?",
        options: ["Adam Smit", "Aristotel", "Antuan de Monkretyen", "Karl Marks"],
        answer: "Antuan de Monkretyen",
      },
      {
        question: "Iqtisodiy tahlilda miqdoriy o‘lchamlarni o‘rganishda qaysi usul qo‘llaniladi?",
        options: ["Tarixiy", "Matematik", "Mantiqiy", "Normativ"],
        answer: "Matematik",
      },
      {
        question: "Muvozanatlashgan iqtisodiy model qaysi?",
        options: ["Xarajatlar modeli", "Narx modeli", "Yalpi talab va yalpi taklif modeli", "Ish haqi modeli"],
        answer: "Yalpi talab va yalpi taklif modeli",
      },
      {
        question: "Infratuzilma nima?",
        options: ["Ishlab chiqarish va ayirboshlash jarayonlarining normal faoliyat yuritishini ta’minlovchi sohalar majmui", "Faqat transport tizimi", "Faqat aloqa tizimi", "Faqat xizmatlar sohasi"],
        answer: "Ishlab chiqarish va ayirboshlash jarayonlarining normal faoliyat yuritishini ta’minlovchi sohalar majmui",
      },
      {
        question: "Quyidagilardan qaysi biri uzoq muddatli iqtisodiy o‘sishning eng muhim omillaridan biri hisoblanadi?",
        options: ["Tabiiy resurslar", "Ta’lim va innovatsiyalar", "Valyuta kursi", "Bojxona to‘lovlari"],
        answer: "Ta’lim va innovatsiyalar",
      },
    ],
  },
  {
    category: "iq",
    topic: "Bozor iqtisodiyoti va uning mexanizmi",
    questions: [
      {
        question: "Bozor iqtisodiyotining asosiy mexanizmi qanday shakllangan?",
        options: ["Bir necha asrlar davomida evolyutsiya orqali", "Markazlashgan reja asosida", "Hukumatning to‘g‘ridan-to‘g‘ri boshqaruvi orqali", "Tasodifiy shaklda rivojlangan"],
        answer: "Bir necha asrlar davomida evolyutsiya orqali",
      },
      {
        question: "Bozor iqtisodiyoti nimaga asoslanadi?",
        options: ["Tovar va pul munosabatlariga", "Tabiiy resurslarning nazoratiga", "Davlat monopoliyasiga", "Ishchi kuchining yagona tizimiga"],
        answer: "Tovar va pul munosabatlariga",
      },
      {
        question: "Bozor iqtisodiyotining asosiy subyektlari qaysilar?",
        options: ["Faqat tadbirkorlar", "Ishchilar, tadbirkorlar va iste’molchilar", "Faqat davlat tashkilotlari", "Qishloq xo‘jaligi korxonalari"],
        answer: "Ishchilar, tadbirkorlar va iste’molchilar",
      },
      {
        question: "Bozor iqtisodiyoti qanday tizimni rad etadi?",
        options: ["Hukumat nazorati", "Raqobatni rag‘batlantirish tizimi", "Iqtisodiy raqobatsizlik yoki monopolizmni", "Bozorning mustaqilligi"],
        answer: "Iqtisodiy raqobatsizlik yoki monopolizmni",
      },
      {
        question: "Bozor iqtisodiyoti nimani o‘z ichiga oladi?",
        options: ["Faqat ishlab chiqarish va iste’molni", "Ishlab chiqarish, taqsimot va iste’mol jarayonlarini", "Faqat tabiiy resurslardan foydalanishni", "Faqat pul muomalasini"],
        answer: "Ishlab chiqarish, taqsimot va iste’mol jarayonlarini",
      },
      {
        question: "Bozor iqtisodiyotining rivojlanishiga nima turtki beradi?",
        options: ["Xususiy mulkchilik", "Davlat rejalashtiruvi", "Faqat xalqaro savdo", "Tabiiy resurslarni qayta ishlash"],
        answer: "Xususiy mulkchilik",
      },
      {
        question: "Bozor iqtisodiyotida tovar va xizmatlar qanday taqsimlanadi?",
        options: ["Hukumat tomonidan boshqariladi", "Narx mexanizmi orqali", "Tabiiy resurslarga qarab taqsimlanadi", "Ishchilarning talabiga ko‘ra"],
        answer: "Narx mexanizmi orqali",
      },
      {
        question: "Bozor iqtisodiyoti erkinligi nimada ko‘rinadi?",
        options: ["Hukumatning qattiq nazoratida", "Subyektlarning iqtisodiy mustaqilligida", "Ishlab chiqarish vositalarining davlatga tegishliligida", "Faqat qishloq xo‘jaligi sohasida"],
        answer: "Subyektlarning iqtisodiy mustaqilligida",
      },
      {
        question: "Bozor iqtisodiyotining afzalliklari nimada?",
        options: ["Iqtisodiy resurslarning erkin harakati", "Hukumat tomonidan to‘liq boshqarilishi", "Faqat yuqori daromadli sohaga yo‘naltirilganligi", "Ishchilar uchun majburiy mehnat"],
        answer: "Iqtisodiy resurslarning erkin harakati",
      },
      {
        question: "Bozor iqtisodiyotining ziddiyatlari qanday namoyon bo‘ladi?",
        options: ["Iqtisodiy raqobat va resurslarni notekis taqsimlashda", "To‘liq iqtisodiy barqarorlikda", "Hukumatning barcha jarayonlarni boshqarishida", "Ishchi kuchining mutlaq yetishmasligida"],
        answer: "Iqtisodiy raqobat va resurslarni notekis taqsimlashda",
      },
      {
        question: "Bozor iqtisodiyotida narxlarning asosiy vazifasi nima?",
        options: ["Faqat davlat daromadini oshirish", "Resurslarni samarali taqsimlash va bozor ishtirokchilariga axborot berish", "Ishchilar sonini ko‘paytirish", "Monopoliyalarni yaratish"],
        answer: "Resurslarni samarali taqsimlash va bozor ishtirokchilariga axborot berish",
      },
      {
        question: "Bozor iqtisodiyotida raqobatning asosiy vazifasi nima?",
        options: ["Narxlarni sun’iy ravishda oshirish", "Korxonalarni davlatga bo‘ysundirish", "Mahsulot sifati va samaradorlikni oshirish", "Importni kamaytirish"],
        answer: "Mahsulot sifati va samaradorlikni oshirish",
      },
      {
        question: "Talab oshib, taklif o‘zgarmasa bozor iqtisodiyotida odatda nima yuz beradi?",
        options: ["Narx pasayadi", "Narx o‘zgarmaydi", "Narx oshadi", "Ishlab chiqarish to‘xtaydi"],
        answer: "Narx oshadi",
      },
      {
        question: "Bozor iqtisodiyotining samarali ishlashi uchun eng muhim shartlardan biri qaysi?",
        options: ["Barcha korxonalarning davlatga tegishli bo‘lishi", "Xususiy mulk huquqining himoyalanishi", "Narxlarning markazlashgan tarzda belgilanishi", "Tashqi savdoning taqiqlanishi"],
        answer: "Xususiy mulk huquqining himoyalanishi",
      },
      {
        question: "Bozor iqtisodiyoti sharoitida korxonaning asosiy maqsadi nima?",
        options: ["Faqat mahsulot hajmini oshirish", "Davlat topshiriqlarini bajarish", "Foyda olish va raqobatbardosh bo‘lish", "Soliqlarni kamaytirish"],
        answer: "Foyda olish va raqobatbardosh bo‘lish",
      },
    ],
  },

  {
    category: "math",
    topic: "Logarifimlar",
    questions: [
      {
        question: "Hisoblang: log₃81",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "4"
      },
      {
        question: "Hisoblang: log₅125 − log₅5",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "2"
      },
      {
        question: "Hisoblang: 2log₂3 − log₂12",
        options: [
          "0",
          "1",
          "log₂6",
          "log₂(3/2)"
        ],
        answer: "0"
      },
      {
        question: "Hisoblang: log₄32 + log₄2",
        options: [
          "log₄64",
          "5",
          "log₄16",
          "log₄8"
        ],
        answer: "log₄64"
      },
      {
        question: "Hisoblang: log₇49 − log₇(1/7)",
        options: [
          "0",
          "1",
          "2",
          "3"
        ],
        answer: "3"
      },
      {
        question: "Hisoblang: log₂18 − log₂9",
        options: [
          "log₂2",
          "1",
          "log₂3",
          "2"
        ],
        answer: "1"
      },
      {
        question: "Hisoblang: log₃27 + log₃9 − log₃81",
        options: [
          "1",
          "2",
          "3",
          "4"
        ],
        answer: "1"
      },
      {
        question: "Hisoblang: log₅√125",
        options: [
          "1/2",
          "2/3",
          "3/2",
          "5/2"
        ],
        answer: "3/2"
      },
      {
        question: "Hisoblang: log₂8 + log₂4 + log₂16",
        options: [
          "6",
          "9",
          "12",
          "15"
        ],
        answer: "9"
      },
      {
        question: "Hisoblang: log₃54 − log₃6 + 2log₃2",
        options: [
          "2",
          "3",
          "4",
          "5"
        ],
        answer: "3"
      },
      {
        question: "Hisoblang: log₂3 + log₂12 − log₂6",
        options: [
          "log₂2",
          "1",
          "log₂3",
          "2"
        ],
        answer: "log₂6"
      },
      {
        question: "Hisoblang: log₅125 + 1/2 log₅25",
        options: [
          "2",
          "5/2",
          "7/2",
          "3"
        ],
        answer: "4"
      },
      {
        question: "Hisoblang: log₁⁄₂8",
        options: [
          "-3",
          "-2",
          "2",
          "3"
        ],
        answer: "-3"
      },
      {
        question: "Hisoblang: logₓ9 = 2 bo'lsa, logₓ(1/27) ni toping.",
        options: [
          "-3",
          "-3/2",
          "-2",
          "2"
        ],
        answer: "-3/2"
      },
      {
        question: "Hisoblang: log₂18 − log₂3 + log₂(2/9)",
        options: [
          "log₂4",
          "log₂2",
          "0",
          "log₂6"
        ],
        answer: "log₂4"
      }
    ]
  },


  {
    category: "math",
    topic: "Ildizlar",
    questions: [
      {
        question: "sqrt(144) + sqrt(81) = ?",
        options: [
          "19",
          "20",
          "21",
          "22"
        ],
        answer: "21"
      },
      {
        question: "sqrt(225) - sqrt(64) = ?",
        options: [
          "5",
          "7",
          "8",
          "9"
        ],
        answer: "7"
      },
      {
        question: "sqrt(49) * sqrt(16) = ?",
        options: [
          "24",
          "26",
          "28",
          "30"
        ],
        answer: "28"
      },
      {
        question: "sqrt(400) / sqrt(25) = ?",
        options: [
          "3",
          "4",
          "5",
          "6"
        ],
        answer: "4"
      },
      {
        question: "sqrt(x^2), x = -6 bo'lsa, qiymat nechaga teng?",
        options: [
          "-6",
          "0",
          "6",
          "36"
        ],
        answer: "6"
      },
      {
        question: "sqrt(196) + sqrt(121) = ?",
        options: [
          "23",
          "24",
          "25",
          "26"
        ],
        answer: "25"
      },
      {
        question: "3sqrt(36) - sqrt(81) = ?",
        options: [
          "7",
          "8",
          "9",
          "10"
        ],
        answer: "9"
      },
      {
        question: "sqrt(625) / 5 = ?",
        options: [
          "4",
          "5",
          "6",
          "7"
        ],
        answer: "5"
      },
      {
        question: "sqrt(25 + 119) = ?",
        options: [
          "10",
          "11",
          "12",
          "13"
        ],
        answer: "12"
      },
      {
        question: "2sqrt(100) + sqrt(64) = ?",
        options: [
          "26",
          "27",
          "28",
          "29"
        ],
        answer: "28"
      },
      {
        question: "sqrt(361) - sqrt(169) = ?",
        options: [
          "4",
          "5",
          "6",
          "7"
        ],
        answer: "6"
      },
      {
        question: "sqrt(9 * 16) = ?",
        options: [
          "10",
          "11",
          "12",
          "13"
        ],
        answer: "12"
      },
      {
        question: "sqrt(900) + sqrt(36) = ?",
        options: [
          "34",
          "35",
          "36",
          "37"
        ],
        answer: "36"
      },
      {
        question: "sqrt(x + 9) = 5 bo'lsa, x = ?",
        options: [
          "14",
          "15",
          "16",
          "17"
        ],
        answer: "16"
      },
      {
        question: "sqrt(64) + sqrt(27)/sqrt(3) = ?",
        options: [
          "10",
          "11",
          "12",
          "13"
        ],
        answer: "11"
      }
    ]
  },


];



const escapeSvgText = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const wrapSvgText = (value, maxChars = 34) => {
  const words = String(value).split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (nextLine.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  });

  if (line) lines.push(line);
  return lines.slice(0, 5);
};

const buildQuestionImage = (question, topic, index) => {
  const lines = wrapSvgText(question, 38);
  const svgLines = lines
    .map(
      (line, lineIndex) =>
        `<text x="70" y="${128 + lineIndex * 48}" font-family="Georgia, Times New Roman, serif" font-size="34" font-weight="800" fill="#050505">${escapeSvgText(line)}</text>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="340" viewBox="0 0 900 340">
    <rect width="900" height="340" rx="34" fill="#ffffff"/>
    <rect x="22" y="22" width="856" height="296" rx="28" fill="#ffffff" stroke="#dfe7ff" stroke-width="2"/>
    <text x="70" y="76" font-family="Georgia, Times New Roman, serif" font-size="24" font-weight="800" fill="#2f49b8">Savol ${index + 1} / 15</text>
    <text x="730" y="76" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#526178">${escapeSvgText(topic || "Test")}</text>
    ${svgLines}
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const prepareQuestionsForTopic = (questions, topic) =>
  questions.map((question, index) => {
    let questionImage = question.questionImage;

    // Agar savolda rasm bo'lmasa va image xossasi bo'lsa
    if (!questionImage && question.image) {
      questionImage = question.image;
    }

    return {
      ...question,
      questionImage,
    };
  });


export default function TestCard() {
  const location = useLocation();
  // FUNCTION1_FREE_ACCESS_V15: false = definitely free, so premium gate must not block.
  const routePremiumFlag = location.state?.isPremium;
  const navigate = useNavigate();
  const { testId } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  // FUNCTION1_TESTCARD_ROUTE_FALLBACK_V3:
  // React Router location.state disappears on refresh/direct URL. Keep backend test
  // metadata as a fallback so the legacy local question bank still resolves correctly.
  const [backendTestMeta, setBackendTestMeta] = useState(null);

  // Guests may browse the test catalog, but an account is required to enter a test.
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const category = location.state?.category || backendTestMeta?.subject?.slug;
  const topic = location.state?.title || backendTestMeta?.title;

  // FUNCTION1_TESTBANK_NORMALIZE_V4:
  // Backend/admin data may use visually identical apostrophe characters
  // (', ’, ʻ, ʼ, `). Normalize them before matching the legacy local bank.
  const normalizeTestBankKey = (value) =>
    String(value || "")
      .normalize("NFKC")
      .replace(/[ʻʼ’‘`´]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const questionSet = questionSets.find(
    (item) =>
      normalizeTestBankKey(item.category) === normalizeTestBankKey(category) &&
      normalizeTestBankKey(item.topic) === normalizeTestBankKey(topic)
  );
  const normalizedTopic = topic?.toLowerCase() || "";
  const shouldUseFunctionGraphTest =
    category === "math" &&
    (normalizedTopic.includes("funksiya") || normalizedTopic.includes("grafik"));
  const activeQuestionSet = shouldUseFunctionGraphTest
    ? {
      ...(questionSet || {}),
      category: "math",
      topic: topic || "Funksiya va Grafiklar",
    }
    : questionSet;
  const filteredQuestions = activeQuestionSet
    ? prepareQuestionsForTopic(activeQuestionSet.questions || [], activeQuestionSet.topic || topic)
    : [];

  const [time, setTime] = useState(1800);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [savingResult, setSavingResult] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState(null);
  const [saveError, setSaveError] = useState("");
  const resultAttemptIdRef = useRef(`result-${testId || "test"}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  // FUNCTION1_P2P_ACCESS_GUARD: server-side premium access gate for the local bilmman test UI.
  const [accessChecking, setAccessChecking] = useState(Boolean(testId) && routePremiumFlag !== false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessError, setAccessError] = useState("");
  // FUNCTION1_FREE_ACCESS_V15_RELEASE
  useEffect(() => {
    if (routePremiumFlag === false) {
      setAccessChecking(false);
      if (typeof setAccessDenied === "function") setAccessDenied(false);
      if (typeof setAccessError === "function") setAccessError("");
    }
  }, [routePremiumFlag]);
  const recordedRef = useRef(false);

  // FUNCTION1_RESULTS_SAVE_V13: server-verified save, variable question counts supported.
  const recordResult = useCallback(async (finalAnswers = []) => {
    if (recordedRef.current || !testId) return;
    if (!isAuthenticated) {
      setSaveError("Natijani saqlash uchun tizimga kiring.");
      return;
    }
    recordedRef.current = true;
    setSavingResult(true);
    setSaveError("");
    try {
      const attempt = await recordVerifiedLocalAttemptV13(testId, {
        answers: (finalAnswers || []).map((item, index) => ({
          question_index: Number.isInteger(item.questionIndex) ? item.questionIndex : index,
          selected_answer: item.userAnswer ?? "",
        })),
        duration_seconds: Math.max(0, 1800 - time),
        client_attempt_id: resultAttemptIdRef.current,
      });
      setSavedAttempt(attempt);
      setScore(attempt.score);
    } catch (error) {
      recordedRef.current = false;
      setSaveError(error.message || "Natijani saqlashda xatolik yuz berdi.");
    } finally {
      setSavingResult(false);
    }
  }, [isAuthenticated, testId, time]);

const handleBack = () => {
  const confirmLeave = window.confirm(
    "Haqiqatan ham testni tark etmoqchimisiz? Hozirgi natijalaringiz saqlanmaydi!"
  );
  if (confirmLeave) {
    navigate(-1);
  }
};
  useEffect(() => {
    if (!showModal && time > 0 && !finished) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (time === 0 && !finished) {
      setFinished(true);
      recordResult(answers);
    }
  }, [time, finished, showModal, recordResult, answers]);

  const getOptionValue = (option) => {
    if (typeof option !== "string") return option.label;
    const letter = option.match(new RegExp("^([A-D])\\)\\s*"));
    return letter ? letter[1] : option;
  };

  const getOptionLabel = (option) =>
    typeof option === "string" ? option : option.label;

  const getMedal = (rightCount = score, totalCount = filteredQuestions.length) => {
    const elapsed = 1800 - time;
    const total = totalCount || filteredQuestions.length || 1;
    const percent = (rightCount / total) * 100;

    if (elapsed <= 600 && percent >= 90) {
      return { icon: "\uD83E\uDD47", label: "Oltin", className: "gold" };
    }
    if (elapsed <= 1200 && percent >= 75) {
      return { icon: "\uD83E\uDD48", label: "Kumush", className: "silver" };
    }
    if (elapsed <= 1800 && percent >= 50) {
      return { icon: "\uD83E\uDD49", label: "Bronza", className: "bronze" };
    }
    return { icon: "\uD83D\uDCDD", label: "Qayta urinish", className: "retry" };
  };

  const medal = getMedal(score, Math.max(answers.length, 1));

  const nextQuestion = () => {
    if (!selected) return;

    const activeQuestion = filteredQuestions[current];
    const isCorrect = selected === activeQuestion.answer;
    const finalScore = score + (isCorrect ? 1 : 0);
    if (isCorrect) setScore(finalScore);

    const answerRecord = {
      questionIndex: current,
      question: activeQuestion.question,
      questionImage: activeQuestion.questionImage,
      userAnswer: selected,
      correctAnswer: activeQuestion.answer,
      explanation: activeQuestion.explanation,
      isCorrect,
    };
    const finalAnswers = [...answers, answerRecord];
    setAnswers(finalAnswers);
    setSelected(null);

    if (current < filteredQuestions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
      recordResult(finalAnswers);
    }
  };
  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  if (accessChecking && routePremiumFlag !== false) {
    return (
      <div className="test-container">
        <p>Premium access tekshirilmoqda...</p>
      </div>
    );
  }

  if (accessDenied && routePremiumFlag !== false) {
    return (
      <div className="test-container">
        <h2>Premium test yopiq</h2>
        <p>Bu testni boshlash uchun avval to'lovingiz admin tomonidan tasdiqlanishi kerak.</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Testlarga qaytish</button>
      </div>
    );
  }

  if (accessError && routePremiumFlag !== false) {
    return (
      <div className="test-container">
        <h2>Testni ochib bo'lmadi</h2>
        <p>{accessError}</p>
        <button className="next-btn" onClick={() => navigate("/test")}>Testlarga qaytish</button>
      </div>
    );
  }

  if (!category || !topic || filteredQuestions.length === 0) {
    return (
      <div className="test-container">
        <p>Category yoki mavzu topilmadi.</p>
        <button className="next-btn" onClick={() => navigate("/test")}>
          Chiqish
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="test-container">
        <style>{`
          .test-container { min-height: 100vh; background: #fff; padding: 38px 16px 48px; font-family: Georgia, "Times New Roman", serif; }
          .result-card { width: min(1062px, 100%); margin: 0 auto; background: #fff; box-shadow: 0 18px 45px rgba(25, 42, 90, 0.10); padding: 38px; }
          .result-card h1, .result-card h2 { color: #20338f; text-align: center; }
          .review-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 30px; }
          .feedback-card { border: 2px solid #dfe6ff; padding: 18px; background: #fff; box-shadow: 0 10px 24px rgba(25, 42, 90, 0.06); }
          .feedback-card.correct { border-color: #4cc979; }
          .feedback-card.wrong { border-color: #ff6b6b; }
          .feedback-card img { width: 100%; max-height: 160px; object-fit: contain; margin-bottom: 12px; }
          .feedback-status { font-weight: 800; color: #20338f; }
          .next-btn { min-width: 204px; margin: 28px auto 0; display: block; border: 0; border-radius: 18px; background: #2f49b8; color: #fff; padding: 18px 32px; font-size: 28px; font-weight: 800; cursor: pointer; }
        `}</style>
        <div className="result-card">
          <h1>Natija</h1>
          <h2>
            {score} / {filteredQuestions.length}
          </h2>
          <p className="feedback-status">
            Yakuniy medal: {getMedal(score, filteredQuestions.length).icon} {getMedal(score, filteredQuestions.length).label}
          </p>
          {savingResult && <p className="feedback-status">Natija backendga saqlanmoqda...</p>}
          {savedAttempt && <p className="feedback-status" style={{ color: "green" }}>Natija saqlandi: {savedAttempt.percentage}%</p>}
          {saveError && <p className="feedback-status" style={{ color: "crimson" }}>{saveError}</p>}
          <div className="review-grid">
            {answers.map((item, index) => (
              <div
                className={`feedback-card ${item.isCorrect ? "correct" : "wrong"}`}
                key={index}
              >
                {item.questionImage && (
                  <img src={item.questionImage} alt={`Savol ${index + 1}`} />
                )}
                <h3>Savol {index + 1}</h3>
                <p className="feedback-status">
                  {item.isCorrect ? "To'g'ri" : "Noto'g'ri"}
                </p>
                <p>
                  Siz tanladingiz:
                  <span style={{ color: item.isCorrect ? "green" : "red" }}>
                    {" "}{item.userAnswer}
                  </span>
                </p>
                <p>
                  To'g'ri javob:
                  <span style={{ color: "green" }}> {item.correctAnswer}</span>
                </p>
                {item.explanation && <p>{item.explanation}</p>}
              </div>
            ))}
          </div>
          <button className="next-btn" onClick={() => navigate("/test")}>
            Chiqish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <style>{`
        .test-container {
          min-height: 100vh;
          background: #ffffff;
          padding: 38px 16px 48px;
          font-family: Georgia, "Times New Roman", serif;
        }

        .modal {
          border-radius: 28px !important;
          box-shadow: 0 24px 70px rgba(25, 42, 90, 0.16) !important;
        }

        .modal button,
        .buttons button {
          border-radius: 18px !important;
        }

        .test-topbar {
          width: min(1062px, 100%);
          margin: 0 auto 36px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
        }

        .timer-card {
          justify-self: center;
          background: #2f49b8;
          color: #fff;
          padding: 18px 38px;
          border-radius: 18px;
          font-size: 28px;
          font-weight: 800;
          box-shadow: 0 12px 28px rgba(47, 73, 184, 0.18);
        }

        .medal-chip {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 18px;
          border: 2px solid #2f49b8;
          color: #20338f;
          font-size: 18px;
          font-weight: 800;
          background: #fff;
        }

        .medal-chip.gold { border-color: #f2b705; }
        .medal-chip.silver { border-color: #aeb7c8; }
        .medal-chip.bronze { border-color: #b97835; }
        .medal-chip.retry { border-color: #b8c2dc; color: #526178; }

        .progress-wrap {
          width: min(1062px, 100%);
          margin: 0 auto 44px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: center;
        }

        .progress-count {
          color: #2f49b8;
          font-weight: 800;
          font-size: 18px;
        }

        .progress {
          height: 17px;
          background: #dbe5ff;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: #2d6dff;
          transition: width 0.25s ease;
        }

        .kere {
          width: min(1062px, 100%);
          margin: 0 auto;
        }

        .question-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 18px 45px rgba(25, 42, 90, 0.10);
          padding: 44px;
          margin-bottom: 24px;
        }

        .q-number {
          color: #243fb2;
          font-size: 23px;
          font-weight: 800;
          margin: 0 0 22px;
        }

        .question-card h2 {
          margin: 0;
          font-size: 36px;
          line-height: 1.25;
          color: #050505;
        }

        .question-image-button {
          width: 100%;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
          position: relative;
          display: block;
          overflow: hidden;
        }

        .question-image-button img {
          width: 100%;
          max-height: 360px;
          object-fit: contain;
          display: block;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .question-image-button:hover img {
          filter: blur(2px) brightness(0.66);
          transform: scale(1.01);
        }

        .question-image-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #fff;
          font-size: 21px;
          font-weight: 800;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
        }

        .question-image-button:hover .question-image-overlay {
          opacity: 1;
        }

        .options-card {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
        }

        .option {
          min-height: 88px;
          background: #fff;
          border: 2px solid transparent;
          border-radius: 24px;
          box-shadow: 0 14px 34px rgba(25, 42, 90, 0.075);
          padding: 22px 28px;
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 26px;
          font-weight: 800;
          color: #050505;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        .option:hover,
        .option.active {
          border-color: #2f49d8;
          box-shadow: 0 18px 34px rgba(47, 73, 216, 0.14);
        }

        .option.active {
          transform: translateY(-1px);
        }

        .option-image {
          width: 100%;
          max-height: 118px;
          object-fit: contain;
          display: block;
        }

        .next-btn {
          min-width: 204px;
          margin: 28px auto 0;
          display: block;
          border: 0;
          border-radius: 18px;
          background: #2f49b8;
          color: #fff;
          padding: 18px 32px;
          font-size: 28px;
          font-weight: 800;
          cursor: pointer;
        }

        .next-btn:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }

        .image-preview-modal {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(5, 9, 25, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .image-preview-panel {
          position: relative;
          width: min(1040px, 96vw);
          max-height: 92vh;
          background: #fff;
          padding: 18px;
          border-radius: 28px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .image-preview-panel img {
          width: 100%;
          max-height: 84vh;
          object-fit: contain;
          display: block;
        }

        .preview-close {
          position: absolute;
          top: -18px;
          right: -18px;
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 50%;
          background: #2f49b8;
          color: #fff;
          font-size: 24px;
          font-weight: 800;
          cursor: pointer;
        }

        .result-card {
          width: min(1062px, 100%);
          margin: 0 auto;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 18px 45px rgba(25, 42, 90, 0.10);
          padding: 38px;
        }

        .result-card h1,
        .result-card h2 {
          color: #20338f;
          text-align: center;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
          margin-top: 30px;
        }

        .wrong-card,
        .feedback-card {
          border: 2px solid #dfe6ff;
          padding: 18px;
          background: #fff;
          box-shadow: 0 10px 24px rgba(25, 42, 90, 0.06);
        }

        .feedback-card.correct { border-color: #4cc979; }
        .feedback-card.wrong { border-color: #ff6b6b; }

        .feedback-card img {
          width: 100%;
          max-height: 160px;
          object-fit: contain;
          margin-bottom: 12px;
        }

        .feedback-status {
          font-weight: 800;
          color: #20338f;
        }

        @media (max-width: 760px) {
          .test-topbar,
          .progress-wrap,
          .options-card {
            grid-template-columns: 1fr;
          }

          .medal-chip {
            justify-self: center;
          }

          .question-card {
            padding: 26px;
          }

          .question-card h2 {
            font-size: 28px;
          }

          .option {
            font-size: 22px;
          }
        }
      `}</style>
      {previewImage && (
        <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-panel" onClick={(event) => event.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreviewImage(null)}>
              X
            </button>
            <img src={previewImage} alt="Savol rasmi" />
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal_overlay">
          <div className="modal">

            <h2>{topic}</h2>
            <p>{filteredQuestions.length} ta savol mavjud</p>
            <p>Vaqt: {Math.floor(time / 60)} daqiqa</p>
            <p>Test boshlashga tayormisiz?</p>
            <div className="buttons">
              <button onClick={() => navigate("/test")}>Chiqish</button>
              <button onClick={() => setShowModal(false)}>Boshlash</button>
            </div>
          </div>
        </div>
      )}

      {!showModal && (
        <>
          <div className="test-topbar">
            <span></span>
            <div className="timer-card">Vaqt: {formatTime()}</div>
            <div className={`medal-chip ${medal.className}`}>
              <span>{medal.icon}</span>
              <span>{medal.label}</span>
            </div>
          </div>

          <div className="progress-wrap">
            <span className="progress-count">
              {current + 1}/{filteredQuestions.length}
            </span>
            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${((current + 1) / filteredQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="kere">
            <div className="question-card">
              <p className="q-number">
                Savol {current + 1} / {filteredQuestions.length}
              </p>
              {filteredQuestions[current].questionImage ? (
                <button
                  className="question-image-button"
                  onClick={() => setPreviewImage(filteredQuestions[current].questionImage)}
                  type="button"
                >
                  <img
                    src={filteredQuestions[current].questionImage}
                    alt={`Savol ${current + 1}`}
                  />
                  <span className="question-image-overlay">
                    <span>{"\uD83D\uDC41"}</span>
                    <span>Ko'rib chiqish</span>
                  </span>
                </button>
              ) : (
                <h2>{filteredQuestions[current].question}</h2>
              )}
            </div>
            <div className="options-card">
              {filteredQuestions[current].options.map((opt, index) => {
                const optionValue = getOptionValue(opt);
                return (
                  <div
                    key={index}
                    className={`option ${selected === optionValue ? "active" : ""}`}
                    onClick={() => setSelected(optionValue)}
                  >
                    {typeof opt === "string" ? (
                      getOptionLabel(opt)
                    ) : (
                      <>
                        <span>{opt.label})</span>
                        <img
                          className="option-image"
                          src={opt.image}
                          alt={`${opt.label} variant`}
                        />
                      </>
                    )}
                    
                  </div>

                );
              })}
              <NavLink to="/test">
                                <button className="back-btn-top">
  ← Chiqish
</button>

              </NavLink>


            </div>
          </div>

          <button className="next-btn" onClick={nextQuestion} disabled={!selected}>
            Keyingi
          </button>
        </>
      )}
    </div>
  );
}
