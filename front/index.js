const make_date_string = (date) => date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)

const currency_rates_btn = document.getElementById("currency_rates")
const currency_list_btn = document.getElementById("currency_list")
const currency_plot_btn = document.getElementById("plot")
const body = document.getElementsByTagName("body")[0]
currency_list_btn.onclick = currency_list
currency_rates_btn.onclick = currency_rates

const currency_codes = ["USD", "EUR", "GPB", "JPY", "TRY", "INR", "CNY"]

function default_view(){
    const data_url = "http://localhost:8000/api/data?"
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
    const url = "http://localhost:8000/api/currency"
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
    const url = "http://localhost:8000/api/data?"
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
    content_section.appendChild(currency_list)
    const date_start_input = document.createElement("input")
    const date_end_input = document.createElement("input")
    content_section.appendChild(date_start_input)
    content_section.appendChild(date_end_input)
    const show_btn = document.createElement("button")
    show_btn.textContent = "Show"

    const string2date = (date) => {
        var parts = date.split(".")
        return new Date(parts[0], parts[1] - 1, parts[2])
    }
    
    show_btn.onclick = () => {
        const date_start = string2date(date_start_input.value)
        const date_end = string2date(date_end_input.value)

        if (date_end - date_start > new Date(2) || date_start > date_end){
            alert("Period must be lower than 2 years and date_start must be lower than date_end")
            return
        }

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

    content_section.appendChild(show_btn)
    console.log("end")
}


default_view()
