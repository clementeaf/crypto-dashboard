import { CryptoCardProps } from "~/types/types";
import { formatBtcPrice, formatUsdPrice } from "~/utils/utils";

export default function CryptoCard({ 
  crypto, 
  index
}: CryptoCardProps) {
  const {
    symbol,
    name,
    image,
    current_price,
  } = crypto;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="mr-3">
            <img src={image} alt={symbol} className="w-10 h-10 rounded-full" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <span className="text-gray-500 dark:text-gray-400">{symbol}</span>
          </div>
          <div className="ml-auto">
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded">
              #{index + 1}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-2xl font-bold">
            ${formatUsdPrice(current_price.usd)}
          </h4>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Precio (BTC)
              </div>
              <div className="font-medium">
                {formatBtcPrice(current_price.btc)} BTC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 