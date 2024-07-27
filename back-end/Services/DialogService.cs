
using Google.Cloud.Dialogflow.V2;
using Google.Protobuf;
using Google.Protobuf.Collections;
using Google.Protobuf.WellKnownTypes;
using NuGet.Protocol;

namespace back_end.Services
{
    public class DialogService : IDialogService
    {
        private readonly IMenuService _menuService;
        private static readonly JsonParser _jsonParser = new(JsonParser.Settings.Default.WithIgnoreUnknownFields(true));

        public DialogService(IMenuService menuService)
        {
            _menuService = menuService;
        }

        public async Task<string> ProcessDialogActionAsync(Stream requestBody, CancellationToken cancellationToken)
        {
            string requestJson;
            try
            {
                using (TextReader reader = new StreamReader(requestBody))
                {
                    requestJson = await reader.ReadToEndAsync(cancellationToken);
                }

                WebhookRequest request = _jsonParser.Parse<WebhookRequest>(requestJson);
                var parameters = request.QueryResult.Parameters;
                string displayName = request.QueryResult.Intent.DisplayName;

                WebhookResponse response = new();

                switch(displayName)
                {
                    case "DisplayMenu":
                        response = await HandleGetMenuAsync(cancellationToken);
                        break;
                    case "GetProductInfo":
                        response = await HandleGetProductInfoAsync(parameters, cancellationToken);
                        break;
                    default:
                        response.FulfillmentMessages.Add(new Intent.Types.Message
                        {
                            Text = new Intent.Types.Message.Types.Text
                            {
                                Text_ = { "Unknown intent " }
                            }
                        });
                        break;
                }

                return response.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        private async Task<WebhookResponse> HandleGetMenuAsync(CancellationToken cancellationToken)
        {
            var categories = await _menuService.GetMenuAsync(cancellationToken);

            string menuResponse = "Our menu:\n";
            foreach (var category in categories)
            {
                menuResponse += $"- {category.CategoryName}\n";
                foreach (var product in category.Products)
                {
                    menuResponse += $"  + {product.ProductName}: ${product.Price}\n";
                }
            }

            WebhookResponse response = new();
            response.FulfillmentMessages.Add(new Intent.Types.Message
            {
                Text = new Intent.Types.Message.Types.Text
                {
                    Text_ = { menuResponse }
                }
            });

            return response;
        }

        private async Task<WebhookResponse> HandleGetProductInfoAsync(Struct parameters, CancellationToken cancellationToken)
        {
            bool hasProductName = parameters.Fields.ContainsKey("product") && !string.IsNullOrEmpty(parameters.Fields["product"].ToString()); 

            WebhookResponse response = new();

            if(!hasProductName)
            {
                response.FulfillmentMessages.Add(new Intent.Types.Message
                {
                    Text = new Intent.Types.Message.Types.Text
                    {
                        Text_ = { "No Product Name provided!" }
                    }
                });
            }
            else
            {
                var productName = parameters.Fields["product"].ToString();
                var product = await _menuService.GetProductByNameAsync(productName, cancellationToken);

                if (product == null)
                {
                    response.FulfillmentMessages.Add(new Intent.Types.Message
                    {
                        Text = new Intent.Types.Message.Types.Text
                        {
                            Text_ = { "Product not found" }
                        }
                    });
                }
                else
                {
                    var messages = new List<string>
                    {
                        $"Product: {product.ProductName}\nDescription: {product.Description}\nPrice: ${product.Price}",
                        $"Here's the info for {product.ProductName}: {product.Description}, priced at ${product.Price}.",
                        $"You asked about {product.ProductName}: it costs ${product.Price} and here's what it's about: {product.Description}."
                    };

                    var random = new Random();
                    int index = random.Next(messages.Count);

                    response.FulfillmentMessages.Add(new Intent.Types.Message
                    {
                        Text = new Intent.Types.Message.Types.Text
                        {
                            Text_ = { messages[index] }
                        }
                    });
                }
            }

            return response;
        }
    }
}
