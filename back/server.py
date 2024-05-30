from fastapi import FastAPI
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dto import PlotDTO, CurrencyDTO
from Parser import Parser
from Plot import Plot
from util import DatasetUnit
from config import countries2currency_codes
from datetime import date
from db import DataBase


app = FastAPI()
db = DataBase()


app.add_middleware(
    CORSMiddleware, 
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Server:
    @app.get('/')
    def root():
        return RedirectResponse('/docs')


    @app.post('/api/plot')
    async def build_plot(plot_data: PlotDTO) -> StreamingResponse:
        plot = Plot()
        for country in plot_data.countries:
            code = countries2currency_codes.get(country)
            if not code:
                raise ValueError()
            ds = Parser.parse_dataset(code, plot_data.start_date, plot_data.end_date)
            db.sync(ds)
            plot.add_line(ds)
        return StreamingResponse(content=plot.make_image(), media_type="image/png")


    @app.get('/api/data')
    async def get_data(currency_code: str, period_start: date, period_end: date) -> list[DatasetUnit]:
        ds = Parser.parse_dataset(currency_code, period_start, period_end)
        db.sync(ds)
        return ds


    @app.get('/api/currency')
    async def get_currnency_list() -> list[CurrencyDTO]:
        return Parser.currency_list()


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('server:app', reload=True)
