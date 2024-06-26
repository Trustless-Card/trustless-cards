package soak

import (
	"testing"

	"github.com/smartcontractkit/seth"
	"github.com/stretchr/testify/require"

	"github.com/smartcontractkit/chainlink-testing-framework/logging"
	"github.com/smartcontractkit/chainlink-testing-framework/networks"

	actions_seth "github.com/smartcontractkit/chainlink/integration-tests/actions/seth"
	tc "github.com/smartcontractkit/chainlink/integration-tests/testconfig"
	"github.com/smartcontractkit/chainlink/integration-tests/testsetups"
	"github.com/smartcontractkit/chainlink/integration-tests/utils"
)

func TestOCRSoak(t *testing.T) {
	l := logging.GetTestLogger(t)
	// Use this variable to pass in any custom EVM specific TOML values to your Chainlink nodes
	customNetworkTOML := ``
	// Uncomment below for debugging TOML issues on the node
	// network := networks.MustGetSelectedNetworksFromEnv()[0]
	// fmt.Println("Using Chainlink TOML\n---------------------")
	// fmt.Println(networks.AddNetworkDetailedConfig(config.BaseOCR1Config, customNetworkTOML, network))
	// fmt.Println("---------------------")

	config, err := tc.GetConfig("Soak", tc.OCR)
	require.NoError(t, err, "Error getting config")

	// validate Seth config before anything else
	readSethCfg := config.GetSethConfig()
	require.NotNil(t, readSethCfg, "Seth config shouldn't be nil")

	network := networks.MustGetSelectedNetworkConfig(config.GetNetworkConfig())[0]
	sethCfg, err := utils.MergeSethAndEvmNetworkConfigs(network, *readSethCfg)
	require.NoError(t, err, "Error merging seth and evm network configs")
	err = utils.ValidateSethNetworkConfig(sethCfg.Network)
	require.NoError(t, err, "Error validating seth network config")

	_, err = seth.NewClientWithConfig(&sethCfg)
	require.NoError(t, err, "Error creating seth client")

	ocrSoakTest, err := testsetups.NewOCRSoakTest(t, &config, false)
	require.NoError(t, err, "Error creating soak test")
	if !ocrSoakTest.Interrupted() {
		ocrSoakTest.DeployEnvironment(customNetworkTOML, &config)
	}
	if ocrSoakTest.Environment().WillUseRemoteRunner() {
		return
	}
	t.Cleanup(func() {
		if err := actions_seth.TeardownRemoteSuite(ocrSoakTest.TearDownVals(t)); err != nil {
			l.Error().Err(err).Msg("Error tearing down environment")
		}
	})
	if ocrSoakTest.Interrupted() {
		err = ocrSoakTest.LoadState()
		require.NoError(t, err, "Error loading state")
		ocrSoakTest.Resume()
	} else {
		ocrSoakTest.Setup(&config)
		ocrSoakTest.Run()
	}
}
