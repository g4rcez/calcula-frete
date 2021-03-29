import { FormEvent, useMemo, useState } from "react";
import {
  CurrencyInput,
  CurrencyInputProps,
  currencyToFloat,
  InputProps,
  namedFormatCurrency,
  toCurrency,
} from "the-mask-input";

export const replaceBlankSpace = (str: string) =>
  str.replace(new RegExp(String.fromCharCode(160), "g"), " ");

const info = (() => {
  const infos = namedFormatCurrency("pt-BR", "BRL");
  infos.currency = replaceBlankSpace(`${infos.currency.trim()} `);
  infos.literal = replaceBlankSpace(infos.literal.trim());
  return infos;
})();

export const Input = (props: InputProps) => (
  <label className="block">
    <span className="text-default text-gray-500">{props.placeholder}</span>
    <input
      {...props}
      className="form-input rounded border p-1 text-lg w-full"
    />
  </label>
);

export const Currency = (props: CurrencyInputProps) => (
  <label className="block">
    <span className="text-default text-gray-500">{props.placeholder}</span>
    <CurrencyInput
      {...props}
      className={
        "form-input rounded border p-1 text-lg w-full" +
        ` ${props.className ?? ""}`
      }
    />
  </label>
);

export default function Home() {
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const majorKm = form.elements.namedItem("majorKm") as HTMLInputElement;
    const minorKm = form.elements.namedItem("minorKm") as HTMLInputElement;

    const price = form.elements.namedItem("price") as HTMLInputElement;
    const priceFloat = currencyToFloat(price.value);

    const minorPrice = form.elements.namedItem(
      "minorPrice"
    ) as HTMLInputElement;
    const minorPriceFloat = currencyToFloat(minorPrice.value);

    const result = (minorKm.valueAsNumber * priceFloat) / majorKm.valueAsNumber;
    setValue(result);
    setMessage(() => {
      if (result > minorPriceFloat) return "As viagens são equivalentes";
      return minorPriceFloat > result
        ? `A viagem de menor KM (${minorKm.valueAsNumber} KM) é mais lucrativa`
        : `A viagem de maior KM (${majorKm.valueAsNumber} KM) é mais lucrativa`;
    });
  };

  const currency = useMemo(
    () =>
      toCurrency(`${value * 100}`, {
        decimalSeparator: info.decimal,
        decimalsLength: info.fraction.length,
        prefix: info.currency,
        separator: info.group,
      }),
    [value]
  );

  return (
    <main className="container w-full m-auto">
      <h1 className="text-6xl font-extrabold">App</h1>
      <form onSubmit={onSubmit}>
        <div className="grid gap-x-4 gap-y-4 grid-cols-2 mt-8">
          <Input
            name="majorKm"
            required
            type="number"
            placeholder="Maior viagem em KM"
          />
          <Input
            name="minorKm"
            required
            type="number"
            placeholder="Menor viagem em KM"
          />
          <Currency name="price" required placeholder="Preço da maior viagem" />
          <Currency name="minorPrice" placeholder="Valor do menor frete" />

          <Currency
            className="disabled:cursor-not-allowed disabled:opacity-50"
            disabled
            placeholder="Resultado"
            value={value}
          />
        </div>
        <button
          className="bg-blue-500 px-4 py-2 text-white rounded mt-2 shadow hover:shadow-lg hover:bg-blue-700 animate-all duration-300"
          type="submit"
          style={{ width: "fit-content" }}
        >
          Calcular
        </button>
        {message !== "" && (
          <div className="bg-blue-200 p-4 rounded shadow mt-8 text-gray-600 text-lg">
            {message}
          </div>
        )}
      </form>
    </main>
  );
}
