$(document).ready(function () {
    // Hàm tính số ký tự trùng khớp từ cuối đến đầu
    function computeSuffixMatch(inputWord, compareWord) {
        let matchCount = 0;
        let i = inputWord.length - 1;
        let j = compareWord.length - 1;

        while (i >= 0 && j >= 0 && inputWord[i] === compareWord[j]) {
            matchCount++;
            i--;
            j--;
        }

        return matchCount;
    }

    // Hàm hiển thị kết quả
    function displayResults(result, isRamdom = false) {
        const $resultList = $('#resultList');
        $resultList.empty(); // Xóa kết quả cũ

        if (result.length === 0) {
            $resultList.append('<li class="list-group-item">Không có kết quả.</li>');
            return;
        }

        // Tạo một đối tượng để nhóm các từ theo suffix
        const groupedResults = {};

        result.forEach(item => {
            const suffix = item.suffix;
            const word = item.word;

            if (groupedResults[suffix]) {
                groupedResults[suffix].push(word);
            } else {
                groupedResults[suffix] = [word];
            }
        });

        // Chuyển đối tượng thành mảng các nhóm để dễ sắp xếp
        const groupedArray = Object.keys(groupedResults).map(suffix => {
            return {
                suffix: suffix,
                words: groupedResults[suffix]
            };
        });

        // Sắp xếp các nhóm theo độ dài suffix giảm dần
        groupedArray.sort((a, b) => b.suffix.length - a.suffix.length);

        // Hiển thị kết quả bình tường
        if (isRamdom == false) {
            groupedArray.forEach(group => {
                // Tạo phần tử tiêu đề cho suffix
                const $suffixHeader = $('<li>').addClass('list-group-item list-group-item-primary').html(`<strong>${group.suffix}:</strong>`);
                $resultList.append($suffixHeader);

                // Tạo phần tử danh sách các từ đầy đủ
                const $wordsList = $('<li>').addClass('list-group-item').text(group.words.join(', '));
                $resultList.append($wordsList);
            });
        }
        // Hiển thị kết quả random
        else {
            // Tạo phần tử tiêu đề cho suffix
            const $suffixHeader = $('<li>').addClass('list-group-item list-group-item-primary').html(`<strong>Kết quả:</strong>`);
            $resultList.append($suffixHeader);
            groupedArray.forEach(group => {
                // Tạo phần tử danh sách các từ đầy đủ
                const $wordsList = $('<li>').addClass('list-group-item').text(group.words.join(', '));
                $resultList.append($wordsList);
            });
        }

    }

    // Hàm tìm các từ giống nhất với từ nhập
    function findSimilarWords() {
        const input = $('#searchWord').val().trim();
        if (!input) {
            alert('Vui lòng nhập từ cần tìm!');
            return;
        }

        const results = [];

        words.forEach(word => {
            if (word.toLowerCase() === input.toLowerCase()) {
                // Đảm bảo từ chính nhập vào được ưu tiên
                results.unshift({ word: word, suffix: input });
                return;
            }

            const matchCount = computeSuffixMatch(input, word);
            if (matchCount > 0) {
                // Lấy phần cuối cùng của từ so với số ký tự trùng khớp
                const suffix = word.slice(word.length - matchCount);
                results.push({ word: word, suffix: suffix });
            }
        });

        // Sắp xếp kết quả dựa trên số ký tự trùng khớp (giảm dần)
        results.sort((a, b) => {
            if (a.word.toLowerCase() === input.toLowerCase()) return -1; // Từ chính nhập vào ở đầu
            if (b.word.toLowerCase() === input.toLowerCase()) return 1;
            return b.suffix.length - a.suffix.length;
        });

        displayResults(results);
    }

    // Hàm lấy 20 từ ngẫu nhiên
    function getRandomWords() {
        const results = [];
        const total = words.length;
        if (total === 0) {
            alert('Dữ liệu từ chưa được tải.');
            return;
        }
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * total);
            results.push(words[randomIndex]);
        }

        // Tạo một đối tượng để nhóm các từ theo suffix
        const groupedResults = {};

        results.forEach(word => {
            const suffix = word; // Nếu muốn nhóm toàn bộ từ, thay đổi logic nếu cần
            if (groupedResults[suffix]) {
                groupedResults[suffix].push(word);
            } else {
                groupedResults[suffix] = [word];
            }
        });

        // Chuyển đối tượng thành mảng các nhóm để dễ sắp xếp
        const groupedArray = Object.keys(groupedResults).map(suffix => {
            return {
                suffix: suffix,
                words: groupedResults[suffix]
            };
        });

        console.log(groupedArray)
        // Hiển thị các nhóm kết quả
        displayResults(groupedArray.flatMap(group => group.words.map(word => ({ word: word, suffix: word }))), true);
    }

    // Gán sự kiện click cho nút tìm kiếm
    $('#searchButton').on('click', function () {
        findSimilarWords();
    });

    // Gán sự kiện click cho nút lấy từ ngẫu nhiên
    $('#randomButton').on('click', function () {
        getRandomWords();
    });

    // Gán sự kiện Enter cho ô nhập liệu
    $('#searchWord').on('keypress', function (e) {
        if (e.which === 13) { // Enter key pressed
            findSimilarWords();
        }
    });
});
