import React, { useMemo } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';

const TOKENS = {
  [mainnet.id]: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    scanUrl: 'https://etherscan.io',
  },
  [sepolia.id]: {
    USDT: '0x0F2ea81aA9861Fb237ec85bD18c4D31a4a520a32',
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    scanUrl: 'https://sepolia.etherscan.io',
  },
};

const TokenItem = ({
  token,
  balance,
  isLoading,
  error,
  chainId,
}) => {
  const formattedBalance = useMemo(() => {
    if (!balance || !balance.value) {
      return '0';
    }

    return formatUnits(balance.value, token.decimals);
  }, [balance, token.decimals]);

  const scanUrl = TOKENS[chainId]?.scanUrl || TOKENS[mainnet.id].scanUrl;

  return (
    <div className="border-[#747474aa] border-[0.5px] p-4 rounded-md backdrop-blur-md bg-opacity-60 bg-[black] mb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] flex items-center justify-center text-white text-[12px]">
            {token.symbol}
          </div>

          <div className="ml-3">
            <h3 className="text-white text-lg font-[RobotoMono]">
              {token.name}
            </h3>

            <p className="text-[#EEEEEE] text-sm font-[RobotoMonoLight]">
              {token.symbol}
            </p>
          </div>
        </div>

        <div className="text-right">
          {isLoading ? (
            <p className="text-[#EEEEEE] text-sm font-[RobotoMonoLight]">
              Loading...
            </p>
          ) : error ? (
            <p className="text-red-500 text-sm font-[RobotoMonoLight]">
              Error
            </p>
          ) : (
            <>
              <p className="text-white text-lg font-[RobotoMono]">
                {parseFloat(formattedBalance).toFixed(4)}
              </p>

              <a
                href={`${scanUrl}/token/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EEEEEE] text-xs font-[RobotoMonoLight] hover:text-[#01FFC2] transition-colors"
              >
                {token.address.slice(0, 6)}...{token.address.slice(-4)}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
    watch: true,
  });

  const { data: usdtBalance, isLoading: usdtLoading, error: usdtError } = useBalance({
    address,
    token: TOKENS[chainId]?.USDT,
    watch: true,
  });

  const { data: usdcBalance, isLoading: usdcLoading, error: usdcError } = useBalance({
    address,
    token: TOKENS[chainId]?.USDC,
    watch: true,
  });

  const tokens = !chainId || !TOKENS[chainId]
    ? []
    : [
      {
        address: TOKENS[chainId].USDT,
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        balance: usdtBalance,
        isLoading: usdtLoading,
        error: usdtError,
      },
      {
        address: TOKENS[chainId].USDC,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        balance: usdcBalance,
        isLoading: usdcLoading,
        error: usdcError,
      },
    ];

  if (!isConnected) {
    return (
      <div className="walletInfo p-6 max-w-4xl mx-auto">
        <div className="text-center p-10 border-[#747474aa] border-[0.5px] rounded-md backdrop-blur-md bg-opacity-60 bg-[black]">
          <h2 className="text-2xl font-[RobotoMono] text-white mb-4">
            Wallet Info
          </h2>

          <p className="text-[#EEEEEE] font-[RobotoMonoLight]">
            Connect your wallet to see info
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="walletInfo p-6 max-w-4xl mx-auto">
      <div className="border-[#747474aa] border-[0.5px] rounded-md p-6 backdrop-blur-md bg-opacity-60 bg-[black]">
        <h2 className="text-2xl font-[RobotoMono] text-white mb-6">
          Wallet Info
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-[RobotoMono] text-white mb-3">
            Address
          </h3>

          <div className="bg-[#1a1a1a] p-3 rounded-md">
            <span className="text-[#EEEEEE] font-[RobotoMonoLight] break-all">
              {address}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-[RobotoMono] text-white mb-3">
            ETH Balance
          </h3>

          <div className="bg-[#1a1a1a] p-3 rounded-md">
            {ethLoading ? (
              <p className="text-[#EEEEEE] font-[RobotoMonoLight]">Loading...</p>
            ) : (
              <p className="text-[#EEEEEE] font-[RobotoMonoLight]">
                {ethBalance ? `${ethBalance.formatted} ${ethBalance.symbol}` : '0 ETH'}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-[RobotoMono] text-white mb-3">
            Others
          </h3>

          {!TOKENS[chainId] ? (
            <div className="text-center p-10">
              <p className="text-[#EEEEEE] font-[RobotoMonoLight]">
                The network is not supported
              </p>
            </div>
          ) : (
            <div className="token-list">
              {tokens.map((token) => (
                <TokenItem
                  key={token.address}
                  token={token}
                  balance={token.balance}
                  isLoading={token.isLoading}
                  error={token.error}
                  chainId={chainId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletInfo;
