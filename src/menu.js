const menu_items = [
    // {
    //     name: 'Home',
    //     link: '/home',
    //     icon: 'fa fa-home',
    //     // any_of_it: true,
    //     permissions: [
    //         {
    //             entity: 'ServiceCategory',
    //             permission_key: 'RECENT'
    //         },
    //         {
    //             entity: 'FAQ',
    //             permission_key: 'TRENDING'
    //         },
    //         {
    //             entity: 'FAQ',
    //             permission_key: 'TOP_VIEWED'
    //         }
    //     ]
    // },
    {
        name: 'Menu.Directory',
        link: '/directory',
        icon: 'fa fa-address-book',
        css: 'highlighted lstbrdr',
        // any_of_it: true,
        permissions: [
            {
                entity: 'Directory',
                permission_key: 'SHOW'
            }
        ]
    },
    {
        name: 'Menu.Media',
        link: '/media-items',
        icon: 'fa fa-file-image-o',
        css: 'highlighted lstbrdr',
        // any_of_it: true,
        permissions: [
            {
                entity: 'Media',
                permission_key: 'LIST'
            }
        ]
    },
    {
        name: "Menu.ContentManagement",
        icon: "fa fa-newspaper-o",
        any_of_it: true,
        permissions: [
            {
                entity: "FAQ",
                permission_key: "SAVE"
            },
            {
                entity: "Directory",
                permission_key: "SAVE"
            },
            {
                entity: "FAQ",
                permission_key: "UPDATE"
            },
            {
                entity: "Directory",
                permission_key: "UPDATE"
            },
            {
                entity: "Media",
                permission_key: "UPDATE"
            },
            {
                entity: "Media",
                permission_key: "DELETE MINE"
            },
            {
                entity: "ServiceCategory",
                permission_key: "UPDATE"
            },
            {
                entity: "FAQ",
                permission_key: "DELETE"
            },
            {
                entity: "Directory",
                permission_key: "DELETE"
            },
            {
                entity: "Media",
                permission_key: "DELETE"
            },
            {
                entity: "HashTag",
                permission_key: "UPDATE"
            },
            {
                entity: "HashTag",
                permission_key: "SAVE"
            },
        ],
        child: [
            {
                name: 'Menu.FAQs',
                link: '/faq/list',
                icon: '',
                any_of_it: true,
                permissions: [
                    {
                        entity: 'FAQ',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'FAQ',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'FAQ',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'FAQ',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'FAQ',
                        permission_key: 'DELETE MINE'
                    },
                    {
                        entity: 'FAQ',
                        permission_key: 'PUBLISH'
                    }
                ]
            },
            {
                name: 'Menu.Directory',
                link: '/directory/list',
                icon: '',
                any_of_it: true,
                permissions: [
                    {
                        entity: 'Directory',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.DirectoryLogo',
                link: '/directory-media/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'DirectoryMedia',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'DirectoryMedia',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'DirectoryMedia',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'DirectoryMedia',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'DirectoryMedia',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.MediaContent',
                link: '/media/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'Media',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Media',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Media',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Media',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Media',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.Hashtags',
                link: '/hashtag/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'HashTag',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'HashTag',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'HashTag',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'HashTag',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'HashTag',
                        permission_key: 'DELETE MINE'
                    }
                ]
            }
        ]
    },
    {
        name: "Menu.Settings",
        icon: "fa fa-cog",
        any_of_it: true,
        permissions:[
            {
                entity: 'User',
                permission_key: 'LIST'
            },
            {
                entity: 'User',
                permission_key: 'SAVE'
            },
            {
                entity: 'User',
                permission_key: 'UPDATE'
            },
            {
                entity: 'User',
                permission_key: 'DELETE'
            },
            {
                entity: 'Role',
                permission_key: 'LIST'
            },
            {
                entity: 'Role',
                permission_key: 'SAVE'
            },
            {
                entity: 'Role',
                permission_key: 'UPDATE'
            },
            {
                entity: 'Role',
                permission_key: 'DELETE'
            },
            {
                entity: 'Role',
                permission_key: 'UPDATE MINE'
            },
            {
                entity: 'Role',
                permission_key: 'DELETE MINE'
            },
            {
                entity: "ServiceCategory",
                permission_key: "DELETE"
            },
            {
                entity: "Nationality",
                permission_key: "DELETE"
            },
            {
                entity: "Group",
                permission_key: "DELETE"
            },
            {
                entity: "HashTag",
                permission_key: "UPDATE"
            },
            {
                entity: "Nationality",
                permission_key: "UPDATE"
            },
            {
                entity: "Countries",
                permission_key: "UPDATE"
            },
            {
                entity: "DirectoryType",
                permission_key: "UPDATE"
            },
            {
                entity: "Group",
                permission_key: "UPDATE"
            },
            {
                entity: "ServiceCategory",
                permission_key: "SAVE"
            },
            {
                entity: "HashTag",
                permission_key: "SAVE"
            },
            {
                entity: "Nationality",
                permission_key: "SAVE"
            },
            {
                entity: "Group",
                permission_key: "SAVE"
            }
        ],
        child:[
            {
                name: 'Menu.Categories',
                link: '/categories/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.Nationalities',
                link: '/nationality/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'Nationality',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Nationality',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Nationality',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Nationality',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Nationality',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.Countries',
                link: '/country/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'Country',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Country',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Country',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Country',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Country',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.Languages',
                link: '/languages/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'LIST'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'ServiceCategory',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.DirectoryCountries',
                link: '/directory-country/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'DirectoryCountry',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'DirectoryCountry',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'DirectoryCountry',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'DirectoryCountry',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'DirectoryCountry',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.DirectoryTypes',
                link: '/directory-type/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'Directory',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Directory',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.UserGroups',
                link: '/unit/list',
                any_of_it: true,
                icon: '',
                permissions: [
                    {
                        entity: 'Group',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Group',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Group',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Group',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Group',
                        permission_key: 'DELETE MINE'
                    }

                ]
            },
            {
                name: 'Menu.RoleManagement',
                link: '/role/list',
                // icon: 'fa fa-cog',
                permissions: [
                    {
                        entity: 'Role',
                        permission_key: 'LIST'
                    },
                    {
                        entity: 'Role',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'Role',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'Role',
                        permission_key: 'DELETE'
                    },
                    {
                        entity: 'Role',
                        permission_key: 'UPDATE MINE'
                    },
                    {
                        entity: 'Role',
                        permission_key: 'DELETE MINE'
                    }
                ]
            },
            {
                name: 'Menu.UserManagement',
                link: '/user/list',
                // icon: 'fa fa-user',
                permissions: [
                    {
                        entity: 'User',
                        permission_key: 'LIST'
                    },
                    {
                        entity: 'User',
                        permission_key: 'SAVE'
                    },
                    {
                        entity: 'User',
                        permission_key: 'UPDATE'
                    },
                    {
                        entity: 'User',
                        permission_key: 'DELETE'
                    }
                ]
            }
        ]
    },
    {
        name: 'Menu.SearchAnalytics',
        link: '/search-anlytics/list',
        icon: 'fa fa-line-chart',
        permissions: [
            {
                entity: 'CaptureSearch',
                permission_key: 'LIST'
            }
        ]
    }
];
export default menu_items;
