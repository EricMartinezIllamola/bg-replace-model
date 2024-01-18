// const num_model_04 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-04/main/model.json";
const num_model_06 = "https://raw.githubusercontent.com/EricMartinezIllamola/num-model-06/main/model.json";
const alphabet_model_03 = "https://raw.githubusercontent.com/EricMartinezIllamola/alphabet-model-03/main/model.json";
const alphabet_model_05 = "https://raw.githubusercontent.com/EricMartinezIllamola/alphabet-model-05/main/model.json";
// const global_model_02 = "https://raw.githubusercontent.com/EricMartinezIllamola/global-model-02/main/model.json";
const global_model_03 = "https://raw.githubusercontent.com/EricMartinezIllamola/global-model-03/main/model.json";

const labelMap_alphabet = {
    0: { name: 'A', color: 'purple' },
    1: { name: 'B', color: 'red' },
    2: { name: 'C', color: 'yellow' },
    3: { name: 'D', color: 'lime' },
    4: { name: 'E', color: 'blue' },
    5: { name: 'F', color: 'orange' },
    6: { name: 'G', color: 'black' },
    7: { name: 'H', color: 'white' },
    8: { name: 'I', color: 'darkred' },
    9: { name: 'K', color: 'darkblue' },
    10: { name: 'L', color: 'purple' },
    11: { name: 'M', color: 'red' },
    12: { name: 'N', color: 'yellow' },
    13: { name: 'O', color: 'lime' },
    14: { name: 'P', color: 'blue' },
    15: { name: 'Q', color: 'orange' },
    16: { name: 'R', color: 'black' },
    17: { name: 'S', color: 'white' },
    18: { name: 'T', color: 'darkred' },
    19: { name: 'U', color: 'darkblue' },
    20: { name: 'V', color: 'purple' },
    21: { name: 'W', color: 'red' },
    22: { name: 'X', color: 'yellow' },
    23: { name: 'Y', color: 'lime' },
}

const labelMap_glob = {
    0: { name: '0', color: 'purple' },
    1: { name: '1', color: 'red' },
    2: { name: '2', color: 'yellow' },
    3: { name: '3', color: 'lime' },
    4: { name: '4', color: 'blue' },
    5: { name: '5', color: 'orange' },
    6: { name: '6', color: 'black' },
    7: { name: '7', color: 'white' },
    8: { name: '8', color: 'darkred' },
    9: { name: '9', color: 'darkblue' },
    10: { name: 'A', color: 'purple' },
    11: { name: 'B', color: 'red' },
    12: { name: 'C', color: 'yellow' },
    13: { name: 'D', color: 'lime' },
    14: { name: 'E', color: 'blue' },
    15: { name: 'F', color: 'orange' },
    16: { name: 'G', color: 'black' },
    17: { name: 'H', color: 'white' },
    18: { name: 'I', color: 'darkred' },
    19: { name: 'K', color: 'darkblue' },
    20: { name: 'L', color: 'purple' },
    21: { name: 'M', color: 'red' },
    22: { name: 'N', color: 'yellow' },
    23: { name: 'O', color: 'lime' },
    24: { name: 'P', color: 'blue' },
    25: { name: 'Q', color: 'orange' },
    26: { name: 'R', color: 'black' },
    27: { name: 'S', color: 'white' },
    28: { name: 'T', color: 'darkred' },
    29: { name: 'U', color: 'darkblue' },
    30: { name: 'V', color: 'purple' },
    31: { name: 'W', color: 'red' },
    32: { name: 'X', color: 'yellow' },
    33: { name: 'Y', color: 'lime' },
}

const num = {
    model: num_model_06,
    imgpath: "global_camara",
    label: labelMap_glob
};

const alphabet = {
    model: alphabet_model_05,
    imgpath: "alphabet_camara",
    label: labelMap_alphabet
};

const glob = {
    model: global_model_03,
    imgpath: "global_camara",
    label: labelMap_glob
};

const numArray_04 = [0, 1, 2, 3, 4];
const numArray_59 = [5, 6, 7, 8, 9];
const numArray_09 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const numArray_Voc = [0, 4, 8, 13, 19];
const numArray_AE = [0, 1, 2, 3, 4];
const numArray_FJ = [5, 6, 7, 8];
const numArray_KO = [9, 10, 11, 12, 13];
const numArray_PT = [14, 15, 16, 17, 18];
const numArray_UZ = [19, 20, 21, 22, 23];
const numArray_AZ = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const numArray_Glob = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];

export { num, alphabet, glob, numArray_04, numArray_59, numArray_09, numArray_Voc, numArray_AE, numArray_FJ, numArray_KO, numArray_PT, numArray_UZ, numArray_AZ, numArray_Glob };