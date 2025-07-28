
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Building, Users, FileText, CreditCard, UserCheck } from 'lucide-react';
import { useLogOut } from '../../hooks/useLogOut';
import { OrganizationData, Tab, TabKey, LocationState } from '../../components/orgById/types';
import { toast } from "react-toastify";
import { mockOrgDataMap } from '../../components/orgById/data';


import {
    TabButton,
    OrganizationHeader,
    OverviewTab,
    MembersTab,
    AccessTab,
    AgentsTab,
    BillingTab
} from '../../components/orgById/orgTabs';
import SearchBar from '../../components/ui/SearchBar';
import Blank from '../../components/ui/Blank';
import { useAppContext } from '../../context/appContext';


const OrgById: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { URL } = useAppContext();
    const state = location.state as LocationState;
    const [orgId, setOrgId] = useState<string>();
    const token = localStorage.getItem('token');
    const logOut = useLogOut();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [data, setData] = useState<OrganizationData | null>(null);
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    const tabs: Tab[] = [
        { id: 'overview', label: 'Overview', icon: <Building className="h-4 w-4" /> },
        { id: 'members', label: 'Members', icon: <Users className="h-4 w-4" /> },
        { id: 'access', label: 'Access', icon: <UserCheck className="h-4 w-4" /> },
        { id: 'agents', label: 'Agents', icon: <CreditCard className="h-4 w-4" /> },
        // { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> }
    ];

    useEffect(() => {
        const storedOrgId = localStorage.getItem('orgId');
        if (state && state?.orgId) {
            fetchUserData(token as string, state?.orgId);
            setOrgId(state.orgId)
        }
        else if (storedOrgId) {
            fetchUserData(token as string, storedOrgId);
            setOrgId(storedOrgId);
        }
    }, []);

    const fetchUserData = async (token: string, orgId: string) => {
        console.log("Fetching user data with token:", token);
        setLoading(true);
        try {
            const response = await fetch(`${URL}org/getOrgById/${orgId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const userData = await response.json();
                setData(userData);
                console.log("Fetched user data:", userData);
            } else if (response.status === 401 || response.status === 403) {
                toast.error('Unauthorized access. Logging out...');
                logOut();
            } else {
                toast.error(`User Not Found`);
            }
        } catch (error) {
            toast.error('Failed to fetch user data:');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
        if (e) e.preventDefault();
        const str = orgId ?? "";
        const trimmedTerm = str.trim();
        if (!trimmedTerm) return;

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const response = await fetch(`${URL}org/searchOrg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({ searchTerm: trimmedTerm }),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log("Search Results:", data);
                setData(Array.isArray(data.results) ? data.results[0] : []);
            } else if (response.status === 401 || response.status === 403) {
                toast.error('Unauthorized access. Logging out...');
                logOut();
            } else {
                toast.error(`Organization Not Found`);
            }
        } catch (err) {
            toast.error('Search failed.');
        } finally {
            setLoading(false);
        }
        console.log("org data:", data);
    };

    const handleEdit = (section: string): void => {
        console.log(`Edit ${section}`);
        
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };


    const renderTabContent = (): React.ReactNode => {
        if (!data) return null;

        const commonProps = {
            data,
            onEdit: handleEdit,
            formatDate,
            showPassword,
            setShowPassword
        };

        switch (activeTab) {
            case 'overview':
                return <OverviewTab {...commonProps} />;
            case 'members':
                return <MembersTab {...commonProps} />;
            case 'access':
                return <AccessTab {...commonProps} />;
            case 'agents':
                return <AgentsTab {...commonProps} />;
            // case 'documents':
            //     return <div className="text-center py-8 text-gray-500">Documents section coming soon...</div>;
            case 'billing':
                return <BillingTab {...commonProps} />;;
            default:
                return <div>Select a tab to view content</div>;
        }
    };

    useEffect(() => {
        // If orgId is provided from navigation state, search immediately
        if (orgId) {
            handleSearch();
        }
    }, []);

    return (
        <Blank title="Organization By ID">
            {/* Header Section with Search */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Organization Details</h1>
                        <p className="text-gray-600">Manage org information and settings</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <SearchBar
                            value={orgId ?? ""}
                            onChange={setOrgId}
                            onSearch={handleSearch}
                            placeholder="Search organization..."
                            searchbtn={true}
                            loading={loading}
                            bodycls='w-full sm:w-110'
                        />
                    </div>
                </div>
            </div>

            {/* Organization Header with Logo and Name */}
            {data && <OrganizationHeader data={data} />}

            {data && (
                <>
                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6 mt-5 mb-5" aria-label="Tabs">
                                {tabs.map((tab: Tab) => (
                                    <TabButton
                                        key={tab.id}
                                        tab={tab}
                                        isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id as TabKey)}
                                    />
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </>
            )}

            {!data && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4" />
                        <p>Search for an organization to view details</p>
                        <p className="text-sm mt-2">Try searching for: "orgId" or "name"</p>
                    </div>
                </div>
            )}
        </Blank>
    );
}

export default OrgById;