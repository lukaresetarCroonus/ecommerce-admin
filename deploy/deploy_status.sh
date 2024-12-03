#!/bin/bash
########################################################################################################################
#                                                        README                                                        #
#                                                                                                                      #
#            - slanje na url status da bi mogli da napravimo konzolu aplikaciju da sama radi update                    #
#                                                                                                                      #
#                                                                                                                      #
########################################################################################################################

echo "First arg: $1"
echo "Second arg: $2"

curl -X POST "https://roverkonfigurator.croonus.com/backend/save.php?ENVIRONMENT=$1&EXIT_CODE=$2"
