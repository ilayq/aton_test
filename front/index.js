const make_date_string = (date) => date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
const hex2base64 = (str) => btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")))
const currency_rates_btn = document.getElementById("currency_rates")
const currency_list_btn = document.getElementById("currency_list")
const currency_plot_btn = document.getElementById("plot")
const body = document.getElementsByTagName("body")[0]
currency_list_btn.onclick = currency_list
currency_rates_btn.onclick = currency_rates
currency_plot_btn.onclick = currency_plot

const string2date = (date) => {
    var parts = date.split(".")
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

const currency_codes = ["USD", "EUR", "GPB", "JPY", "TRY", "INR", "CNY"]

function default_view(){
    const data_url = "http://80.76.32.10/api/data?"
    const cur_date = new Date()
    const month_ago = cur_date
    month_ago.setMonth(month_ago.getMonth() - 1)
    const json = fetch(data_url + new URLSearchParams({
        currency_code: 'USD',
        period_end: make_date_string(cur_date),
        period_start: make_date_string(month_ago)
    }), {method: "GET"}).then(response => response.json())
    col_names = ["Code", "Date", "Amount", "Cost", "Delta"]

    content_section = document.createElement("section")
    content_section.id = "content"  
    const table = document.createElement("table")
    table.setAttribute("class", "data")
    const thead = document.createElement("thead")
    const tr_head = document.createElement("tr")
    tr_head.scope = "row"
    col_names.forEach(element => {
        const el = document.createElement("th")
        el.textContent = element
        el.scope = "col"
        tr_head.appendChild(el)
    });
    thead.appendChild(tr_head)
    table.appendChild(thead)
    content_section.appendChild(table)
    body.appendChild(content_section)
    const tbody = document.createElement("tbody")
    json.then(
        data => {
            for (var row of data){
                const tr = document.createElement('tr')
                tr.scope = "row"
                for (var item in row){
                    const td = document.createElement('td')
                    td.textContent = row[item]
                    td.scope = "col"
                    tr.appendChild(td)
                }
                tbody.appendChild(tr)
            }
        }
    )
    table.appendChild(tbody)

    json.then(
        data => {
            for (var row of data){
                const tr = document.createElement('tr')
                for (var item in row){
                    const td = document.createElement('td')
                    td.textContent = row[item]
                    td.setAttribute('align', 'right')
                    tr.appendChild(td)
                }
                tbody.appendChild(tr)
            }
        }
    )
}

function currency_list(){
    const url = "http://80.76.32.10/api/currency"
    const json = fetch(url).then(response => response.json())
    var content_section = document.getElementById("content")
    if (content_section){
        body.removeChild(content_section)
    }
    col_names = ["Country", "Currency", "Code"]

    content_section = document.createElement("section")
    content_section.id = "content"  
    const table = document.createElement("table")
    table.setAttribute("class", "data")
    const thead = document.createElement("thead")
    const tr_head = document.createElement("tr")
    col_names.forEach(element => {
        const el = document.createElement("th")
        el.textContent = element
        tr_head.appendChild(el)
    });
    thead.appendChild(tr_head)
    table.appendChild(thead)
    content_section.appendChild(table)
    body.appendChild(content_section)
    const tbody = document.createElement("tbody")
    json.then(
        data => {
            for (var row of data){
                const tr = document.createElement('tr')
                for (var item in row){
                    const td = document.createElement('td')
                    td.textContent = row[item]
                    td.setAttribute('align', 'right')
                    tr.appendChild(td)
                }
                tbody.appendChild(tr)
            }
        }
    )
    table.appendChild(tbody)
}

function currency_rates(){
    const url = "http://80.76.32.10/api/data?"
    var content_section = document.getElementById("content")
    if (content_section){
        body.removeChild(content_section)
    }
    default_view()
    content_section = document.getElementById("content")

    col_names = ["Currency code", "Date", "Amount", "Cost", "Delta"]

    const tbody = document.getElementsByTagName('tbody')[0]
    const currency_list = document.createElement("select")
    currency_list.id = "currency_list"
    currency_codes.forEach(elem => {
        const opt = document.createElement("option")
        opt.textContent = elem
        currency_list.appendChild(opt)
    })
    const utils_div = document.createElement("div")
    utils_div.appendChild(currency_list)
    utils_div.id = "utils"
    const date_start_input = document.createElement("input")
    const date_end_input = document.createElement("input")
    date_end_input.placeholder = "End of period"
    date_start_input.placeholder = "Beginning of period"
    utils_div.appendChild(date_start_input)
    utils_div.appendChild(date_end_input)
    const show_btn = document.createElement("button")
    show_btn.textContent = "Show"

    
    
    show_btn.onclick = () => {
        const date_start = string2date(date_start_input.value)
        const date_end = string2date(date_end_input.value)

        const currency = currency_list.value
        const json = fetch(url + new URLSearchParams({
            currency_code: currency,
            period_end: make_date_string(date_end),
            period_start: make_date_string(date_start)
        }), {method: "GET"}).then(response => response.json())

        while (tbody.firstChild)
            tbody.removeChild(tbody.firstChild)

        json.then(
            data => {
                for (var row of data){
                    const tr = document.createElement('tr')
                    for (var elem in row){
                        const td = document.createElement('td')
                        td.textContent = row[elem]
                        tr.appendChild(td)
                    }
                    tbody.appendChild(tr)
                }
            }
        )
    }

    utils_div.appendChild(show_btn)
    content_section.append(utils_div)
}

function currency_plot(){
    const url = "http://80.76.32.10/api/plot"
    const c = ["USA", "United Kingdoms", "Japan", "India", "Turkey", "China", "Germany"]
    var content_section = document.getElementById("content")
    if (content_section){
        body.removeChild(content_section)
    }
    content_section = document.createElement("section")
    content_section.id = "content"
    body.appendChild(content_section)
    const choice = document.createElement("div")
    choice.id = "choice"
    content_section.appendChild(choice)
    let checkboxes = []
    c.forEach( el => {
        const label = document.createElement("label")
        choice.appendChild(label)
        const ch = document.createElement("input")
        ch.type = "checkbox"
        ch.id = el
        label.appendChild(ch)
        label.appendChild(document.createTextNode(el))
        choice.appendChild(document.createElement("br"))
        checkboxes.push(ch)
    })

    const date_start_input = document.createElement("input")
    const date_end_input = document.createElement("input")
    date_end_input.placeholder = "End of period"
    date_start_input.placeholder = "Beginning of period"
    choice.appendChild(date_start_input)
    choice.appendChild(document.createElement("br"))
    choice.appendChild(date_end_input)
    choice.appendChild(document.createElement("br"))
    const show_btn = document.createElement("button")
    show_btn.textContent = "Show"
    choice.appendChild(show_btn)

    show_btn.onclick = () => {
        const img_tag = document.getElementsByTagName("img")[0]
        if (img_tag){
            content_section.removeChild(img_tag)
        }
        let chosen_countries = []
        checkboxes.forEach( el => {
            if (el.checked){
                chosen_countries.push(el.id)
            }
        })
        if (chosen_countries.length === 0){
            return
        }

        const date_start = make_date_string(string2date(date_start_input.value))
        const date_end = make_date_string(string2date(date_end_input.value))
        if (!date_start || !date_end)
            return
        plot(chosen_countries, date_start, date_end)
    }

    function plot(country_list, start_date, end_date){
        const fetch_body = {
            "countries": country_list,
            "start_date": start_date,
            "end_date": end_date
        }
        const data = fetch(
            url, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=windows-1251",
                    "Access-Control-Allow-Origin": "true"
                },
                body: JSON.stringify(fetch_body)
            }
        )
        data.then(response => {
            if (response.status != 200){
                return
            }
            const img = document.createElement("img")
            const reader = response.body.getReader();
            let chunks = [];
            
            reader.read().then(function processText({done, value}) {
                if (done) {
                    const blob = new Blob(chunks, { type: 'image/png' });
                    const imageURL = URL.createObjectURL(blob);
                    img.src = imageURL;
                } else {
                    chunks.push(value);
                    return reader.read().then(processText);
                }
            });
            content_section.appendChild(img)
        });
    }

}

default_view()
