import matplotlib.pyplot as plt
from Parser import Parser
from datetime import date

from util import DatasetUnit
from PIL import Image
from io import BytesIO


class Plot:
    def __init__(self):
        plt.clf()
        self.plt_cur_color_pointer = 0
        self.colors = 'bgrcmykw'
        self.legend = []

    def add_line(self, ds: list[DatasetUnit]) -> None:
        color = self.colors[self.plt_cur_color_pointer]
        self.plt_cur_color_pointer += 1
        xs = []
        ys = []
        code = ds[0].currency_code
        self.legend.append(code)
        for unit in ds:
            xs.append(unit.d)
            ys.append(unit.delta)
        plt.plot_date(xs, ys, fmt=f',-{color}', label=f'{code}')

    def make_image(self) -> BytesIO:
        plt.xticks(rotation=90)
        plt.legend(self.legend)
        fig = plt.gcf()
        fig.set_size_inches(19, 9)

        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        return buf


if __name__ == '__main__':
    start = date(2022, 4, 17)
    end = date(2024, 4, 17)

    ds_eur = Parser.parse_dataset('EUR', start, end)
    ds_usd = Parser.parse_dataset('USD', start, end)

    pl = Plot()
    pl.add_line(ds_eur)
    pl.add_line(ds_usd)
