// Code generated by mockery v2.42.2. DO NOT EDIT.

package mocks

import (
	context "context"

	ocr "github.com/smartcontractkit/chainlink/v2/core/services/ocr"
	mock "github.com/stretchr/testify/mock"

	offchainaggregator "github.com/smartcontractkit/libocr/gethwrappers/offchainaggregator"

	sqlutil "github.com/smartcontractkit/chainlink-common/pkg/sqlutil"
)

// OCRContractTrackerDB is an autogenerated mock type for the OCRContractTrackerDB type
type OCRContractTrackerDB struct {
	mock.Mock
}

// LoadLatestRoundRequested provides a mock function with given fields: ctx
func (_m *OCRContractTrackerDB) LoadLatestRoundRequested(ctx context.Context) (offchainaggregator.OffchainAggregatorRoundRequested, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for LoadLatestRoundRequested")
	}

	var r0 offchainaggregator.OffchainAggregatorRoundRequested
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (offchainaggregator.OffchainAggregatorRoundRequested, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) offchainaggregator.OffchainAggregatorRoundRequested); ok {
		r0 = rf(ctx)
	} else {
		r0 = ret.Get(0).(offchainaggregator.OffchainAggregatorRoundRequested)
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// SaveLatestRoundRequested provides a mock function with given fields: ctx, rr
func (_m *OCRContractTrackerDB) SaveLatestRoundRequested(ctx context.Context, rr offchainaggregator.OffchainAggregatorRoundRequested) error {
	ret := _m.Called(ctx, rr)

	if len(ret) == 0 {
		panic("no return value specified for SaveLatestRoundRequested")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, offchainaggregator.OffchainAggregatorRoundRequested) error); ok {
		r0 = rf(ctx, rr)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// WithDataSource provides a mock function with given fields: _a0
func (_m *OCRContractTrackerDB) WithDataSource(_a0 sqlutil.DataSource) ocr.OCRContractTrackerDB {
	ret := _m.Called(_a0)

	if len(ret) == 0 {
		panic("no return value specified for WithDataSource")
	}

	var r0 ocr.OCRContractTrackerDB
	if rf, ok := ret.Get(0).(func(sqlutil.DataSource) ocr.OCRContractTrackerDB); ok {
		r0 = rf(_a0)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(ocr.OCRContractTrackerDB)
		}
	}

	return r0
}

// NewOCRContractTrackerDB creates a new instance of OCRContractTrackerDB. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewOCRContractTrackerDB(t interface {
	mock.TestingT
	Cleanup(func())
}) *OCRContractTrackerDB {
	mock := &OCRContractTrackerDB{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
